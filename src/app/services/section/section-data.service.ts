import { SectionParentListMergeResolver } from './../../models/section-parent-list-merge-resolver.model';
import { SectionParentDtoV1 } from './../../models/section-parent-dto-1.model';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { User } from 'firebase';
import { cloneDeep } from 'lodash';
import { compress, decodeBase64, decompress, encodeBase64 } from 'lzutf8';
import { BehaviorSubject, from, Observable, Subscription, throwError, of, concat } from 'rxjs';
import { map, takeWhile, tap, take, concatMap, skip, flatMap } from 'rxjs/operators';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { SectionParent, SectionParentInterface } from 'src/app/models/section-parent.model';
import { BibleDataService } from 'src/app/services/bible/bible-data.service';
import { LogService } from './../../logger/log.service';
import { SectionParentList as SectionParentList } from './../../models/section-parent-list.model';
import { SectionFactory } from './section-factory';
import hash from 'object-hash';

@Injectable({
  providedIn: 'root'
})
export class SectionDataService extends LogWrapper implements OnDestroy {
  
  private user: User;

  constructor(
    logService: LogService,
    private sectionFactory: SectionFactory,
    private firestore: AngularFirestore,
    private bibleDataService: BibleDataService,
    private auth: AngularFireAuth
  ) {
    super(logService);
    this.auth.authState.subscribe(user => {
      this.user = user;
      user && LocalData.convertLocalGuestToUserData(user);
    });
    firestore.firestore.enablePersistence({
      synchronizeTabs: true
    });
  }
  
  ngOnDestroy() { }
  
  /**
   * Gets the list view. Assumes that there is no change in login status over the course of the stream.
   * If the user is not logged in, emits localdata once
   * If the user is logged in, streams cloud data and always merges it with local
   */
  public getSectionParentList(id?: string): Observable<SectionParentListMergeResolver> {
    const getUser = this.auth.authState.pipe(tap(user => this.user = user), take(1));
    const getFromCloud = user => {
      const where: QueryFn = id 
        ? ref => ref.where('authorUid', '==', user.uid).where('id', '==', id)
        : ref => ref.where('authorUid', '==', user.uid);
      return from(this.firestore.collection<SectionParentDtoV1>('sections', where).valueChanges())
        .pipe(
          map((data: SectionParentDtoV1[]) => {
            const localData = LocalData.get(null);
            if (!localData.length) {
              return new SectionParentListMergeResolver(this.sectionFactory.fromSectionParentListJson(this.fromSectionParentsDto(data)));
            } else {
                return new SectionParentListMergeResolver(
                  this.sectionFactory.fromSectionParentListJson(this.fromSectionParentsDto(localData)),
                  this.sectionFactory.fromSectionParentListJson(this.fromSectionParentsDto(data))
                );
            }
          })
        );
    }
    const getFromLocal = user => of(this.sectionFactory.fromSectionParentListJson(this.fromSectionParentsDto(LocalData.get(null))))
      .pipe(
        map((data: SectionParentList) => new SectionParentListMergeResolver(data)),
        take(1)
      );
    return getUser.pipe(flatMap(user => user ? getFromCloud(user) : getFromLocal(null)));
  }
  
  public save(sectionParent: SectionParent): Observable<boolean> {
    if (this.user) {
      sectionParent.lastUpdatedByUid = this.user.uid;
      sectionParent.lastUpdatedByName = this.user.displayName;
    }
    sectionParent.incrementVersion();
    sectionParent.lastUpdatedDate = new Date();
    const saveObj = this.toSectionParentDto(sectionParent);
    
    LocalData.save(saveObj, this.user);
    
    saveObj.isSavedToCloud = true;
    
    try {
      return from(this.firestore.collection('sections').doc(sectionParent.id).set(saveObj))
        .pipe(
          tap(data => this.logService.log(data)),
          map(data => {
            return true;
          })
        );
    } catch(e) {
      this.logService.error(e);
      return throwError(e);
    }
  }
  
  public create(): SectionParent {
    return this.sectionFactory.fromSectionParentJson({
      
    })
  }
  
  private toSectionParentDto(sectionParent: SectionParent): SectionParentDtoV1 {
    const clone: SectionParent = cloneDeep(sectionParent);
    delete clone.multiRanges;
    clone.forAllDescendents(section => section.clearUnsavedFields());
    const res = <SectionParentDtoV1><any> clone;
    res.sections = this.compress(clone.sections);
    res.createdDate = clone.createdDate.getTime();
    res.lastUpdatedDate = clone.lastUpdatedDate.getTime();
    return Object.assign({}, res);
  }
  
  private fromSectionParentsDto(sps: SectionParentDtoV1[]): SectionParentInterface[] {
    return (sps || []).map(sp => this.fromSectionParentDto(sp));
  }
  
  private fromSectionParentDto(sectionParent: SectionParentDtoV1): SectionParentInterface {
    sectionParent.sections = this.decompress(<any> sectionParent.sections);
    return <SectionParentInterface><any> sectionParent;
  }
  
  public export(sectionParent: SectionParent): string {
    return this.compress(this.toSectionParentDto(sectionParent));
  }
  
  public import(str: string): SectionParent {
    return this.sectionFactory.fromSectionParentJson(this.decompress(str) || {});
  }
  
  private compress(data): string {
    return encodeBase64(compress(JSON.stringify(data)));
  }
  
  private decompress<T>(data: string): T {
    return JSON.parse(decompress(decodeBase64(data)));
  }
}

class LocalData {
  public static convertLocalGuestToUserData(user: User): void {
    const keys = this.getKeys(null);
    keys.forEach(key => {
      const data = this.getByKey(key);
      this.delete(key);
      this.save(data, user);
    });
  }
  
  /**
   * Save data to local. If the user is logged in, save it for the user, if not, save it as GUEST data
   */
  public static save(sp: SectionParentDtoV1, user: User): void {
    localStorage.setItem(this.prefix(user) + sp.id, JSON.stringify(sp));
  }
  
  public static get(user: User, id?: string): SectionParentDtoV1[] {
    const keys = this.getKeys(user, id);
    return keys.map(key => this.getByKey(key));
  }
  
  public static delete(key: string): void {
    return localStorage.removeItem(key);
  }
  
  private static getKeys(user: User, id?: string): string[] {
    return Object.keys(localStorage).filter(key => key.startsWith(this.prefix(user, id)));
  }
  
  private static getByKey(key: string): SectionParentDtoV1 {
    return JSON.parse(localStorage.getItem(key));
  }
  
  private static prefix(user: User, id?: string): string {
    return 'sectionParentData_' + (user ? user.uid + '_' : 'GUEST_') + (id ? id : '');
  }
}