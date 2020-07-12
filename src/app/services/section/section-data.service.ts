import { SectionsParentList } from './../../models/sections-parent-list.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { cloneDeep } from 'lodash';
import { LogService } from './../../logger/log.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { SectionFactory } from './section-factory';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { SectionsParentInterface, SectionsParent } from 'src/app/models/sections-parent.model';
import { of, Observable, from, throwError } from 'rxjs';
import { compress, decompress, encodeBase64, decodeBase64 } from 'lzutf8';
import { User, database } from 'firebase';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SectionDataService extends LogWrapper implements OnDestroy {
  
  private user: User;

  constructor(
    logService: LogService,
    private sectionFactoryService: SectionFactory,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    super(logService);
    this.auth.authState.subscribe(user => {
      this.user = user;
    });
    this.firestore.collection<SectionsParentInterface>('sections')//, ref => ref.where('authorUid', '==', this.user.uid))
      .snapshotChanges()
      .subscribe(data => {
        debugger;
      })
  }
  
  ngOnDestroy() { }

  public getSections(): Observable<SectionsParentList> {
    let get//<SectionsParentInterface>;
    if (!this.user) {
      get = of(this.getFromLocal() || [])
        .pipe(map(sps => this.sectionFactoryService.fromSectionsParentListJson(sps)));
    } else if (this.user !== null) {
      // get = from(this.firestore.collection<SectionsParentInterface>('sections', ref => ref.where('authorUid', '==', this.user.uid))
      get = from(this.firestore.collection<SectionsParentInterface>('sections')//, ref => ref.where('authorUid', '==', this.user.uid))
        .get())
      this.firestore.collection<SectionsParentInterface>('sections')//, ref => ref.where('authorUid', '==', this.user.uid))
        .snapshotChanges()
        .subscribe(data => {
          debugger;
        })
    }
    return get;
  }

  public save(sectionsParent: SectionsParent): Observable<boolean> {
    try {
      return from(this.firestore.collection('sections').add(this.toSectionsParentFirebase(sectionsParent)))
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
  
  public toSectionsParentFirebase(sectionsParent: SectionsParent): SectionsParentInterface {
    const clone: SectionsParent = cloneDeep(sectionsParent);
    delete clone.multiRanges;
    clone.forAllDescendents(section => section.clearUnsavedFields());
    (<any> clone.sections) = encodeBase64(compress(JSON.stringify(clone.sections)));
    // clone.authorUid = this.user.uid;
    // clone.authorName = this.user.displayName;
    
    if (this.user) {
      clone.lastUpdatedByUid = this.user.uid;
      clone.lastUpdatedByName = this.user.displayName;
    }
    clone.lastUpdatedDate = new Date();
    // clone.createdDate = createdDate;
    return Object.assign({}, clone);
  }
  
  public fromSectionsParentFirebase(sectionsParent: SectionsParentInterface): SectionsParentInterface {
    sectionsParent.sections = decompress(decodeBase64(<any> sectionsParent.sections));
    return sectionsParent;
  }
  
  private saveToLocal(sp: SectionsParentList): void {
    localStorage.setItem('sectionsParentData', JSON.stringify(sp));
  }
  
  public getFromLocal(): SectionsParentInterface | SectionsParentInterface[] { // temp backward compat code
    return JSON.parse(localStorage.getItem('sectionsParentData'));
  }
  
  public export(sectionsParent: SectionsParent): string {
    const clone: SectionsParent = cloneDeep(sectionsParent);
    clone.forAllDescendents(section => section.clearUnsavedFields());
    return encodeBase64(compress(JSON.stringify(clone)));
  }
  
  public import(str: string): SectionsParent {
    const data = decompress(decodeBase64(str))
    return this.sectionFactoryService.fromSectionsParentJson(JSON.parse(data) || {});
  }
}