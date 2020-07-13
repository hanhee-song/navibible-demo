import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { cloneDeep } from 'lodash';
import { compress, decodeBase64, decompress, encodeBase64 } from 'lzutf8';
import { BehaviorSubject, from, Observable, Subscription, throwError } from 'rxjs';
import { map, takeWhile, tap } from 'rxjs/operators';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { SectionsParent, SectionsParentInterface } from 'src/app/models/sections-parent.model';
import { BibleDataService } from 'src/app/services/bible/bible-data.service';
import { LogService } from './../../logger/log.service';
import { SectionsParentList } from './../../models/sections-parent-list.model';
import { SectionFactory } from './section-factory';

@Injectable({
  providedIn: 'root'
})
export class SectionDataService extends LogWrapper implements OnDestroy {
  
  public onFirestoreData$: BehaviorSubject<SectionsParentList> = new BehaviorSubject<SectionsParentList>(null);
  public onLocalData$: BehaviorSubject<SectionsParentList> = new BehaviorSubject<SectionsParentList>(null);
  
  private user: User;

  constructor(
    logService: LogService,
    private sectionFactory: SectionFactory,
    private firestore: AngularFirestore,
    private bibleDataService: BibleDataService,
    private auth: AngularFireAuth
  ) {
    super(logService);
    this.bibleDataService.isDataReady$
      .pipe(takeWhile(ready => !ready, true))
      .subscribe(ready => {
        if (ready) {
          this.subscribeToFirestore();
          this.subscribeToLocal();
        }
      })
  }
  
  ngOnDestroy() { }
  
  /**
   * Subscribes to and emits cloud data when available. Emits every update.
   */
  private subscribeToFirestore(): void {
    let get: Subscription;
    
    this.auth.authState.subscribe(user => {
      this.user = user;
      if (!this.user) {
        get && get.unsubscribe();
      } else {
        get = from(this.firestore.collection<SectionsParentInterface>('sections', ref => ref.where('authorUid', '==', this.user.uid))
          .valueChanges())
          .subscribe(data => {
            this.onFirestoreData$.next(this.sectionFactory.fromSectionsParentListJson(this.fromSectionsParentsDto(data)));
            // todo: deal with logged-in offline mode here
          });
      }
    });
  }
  
  /**
   * Subscribes to and emits local data when available. Emits only once per session.
   */
  private subscribeToLocal(): void {
    this.auth.authState.subscribe(user => {
      const data = this.sectionFactory.fromSectionsParentListJson(this.fromSectionsParentsDto(this.getAllFromLocal()));
      this.onLocalData$.next(data);
    });
  }

  public save(sectionsParent: SectionsParent): Observable<boolean> {
    if (this.user) {
      sectionsParent.lastUpdatedByUid = this.user.uid;
      sectionsParent.lastUpdatedByName = this.user.displayName;
    }
    sectionsParent.lastUpdatedDate = new Date();
    const saveObj = this.toSectionsParentDto(sectionsParent);
    
    this.saveToLocal(saveObj);
    
    try {
      return from(this.firestore.collection('sections').doc(sectionsParent.id).set(saveObj))
        .pipe(
          tap(data => this.logService.log(data)),
          map(data => {
            debugger
            return true;
          })
        );
    } catch(e) {
      this.logService.error(e);
      return throwError(e);
    }
  }
  
  private toSectionsParentDto(sectionsParent: SectionsParent): SectionsParentInterface {
    const clone: SectionsParent = cloneDeep(sectionsParent);
    delete clone.multiRanges;
    clone.forAllDescendents(section => section.clearUnsavedFields());
    (<any> clone.sections) = this.compress(clone.sections);
    return Object.assign({}, clone);
  }
  
  private fromSectionsParentsDto(sps: SectionsParentInterface[]): SectionsParentInterface[] {
    return (sps || []).map(sp => this.fromSectionsParentDto(sp));
  }
  
  private fromSectionsParentDto(sectionsParent: SectionsParentInterface): SectionsParentInterface {
    sectionsParent.sections = this.decompress(<any> sectionsParent.sections);
    return sectionsParent;
  }
  
  private saveToLocal(sp: SectionsParentInterface): void {
    localStorage.setItem('sectionParentData_' + sp.id, JSON.stringify(sp));
  }
  
  private getAllFromLocal(): SectionsParentInterface[] {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('sectionParentData_'));
    return keys.map(key => this.getFromLocal(key));
  }
  
  private getFromLocal(key: string): SectionsParentInterface {
    return JSON.parse(localStorage.getItem(key));
  }
  
  public export(sectionsParent: SectionsParent): string {
    const clone: SectionsParent = cloneDeep(sectionsParent);
    clone.forAllDescendents(section => section.clearUnsavedFields());
    return this.compress(clone);
  }
  
  public import(str: string): SectionsParent {
    return this.sectionFactory.fromSectionsParentJson(this.decompress(str) || {});
  }
  
  private compress(data): string {
    return encodeBase64(compress(JSON.stringify(data)));
  }
  
  private decompress<T>(data: string): T {
    return JSON.parse(decompress(decodeBase64(data)));
  }
}