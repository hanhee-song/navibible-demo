import { SectionParentListMergeResolver } from './../../models/section-parent-list-merge-resolver.model';
import { ActivatedRoute, Routes } from '@angular/router';
import { User } from 'firebase';
import { SectionParentList } from './../../models/section-parent-list.model';
import { NotificationService } from './../controls/notification.service';
import { LogService } from './../../logger/log.service';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs/internal/Observable';
import { SectionParent } from './../../models/section-parent.model';
import { SectionDataService } from './section-data.service';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { tap, map, catchError } from 'rxjs/operators';
import { Section } from 'src/app/models/section.model';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { of, BehaviorSubject, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class SectionService extends LogWrapper implements OnDestroy {

  // public onSectionParent$: BehaviorSubject<SectionParent> = new BehaviorSubject<SectionParent>(null);
  // public onSectionParentList$: BehaviorSubject<SectionParentList> = new BehaviorSubject<SectionParentList>(null);
  
  private sectionParentList: SectionParentList;
  private currentSectionParentOriginalState: SectionParent;
  private currentSectionParentIdSectionMap: Map<number, Section> = new Map();
  private user: User;

  constructor(
    logService: LogService,
    private sectionDataService: SectionDataService,
    private notificationsService: NotificationService,
    private auth: AngularFireAuth,
    private route: ActivatedRoute
  ) {
    super(logService);
    
    this.auth.authState.subscribe(user => {
      this.user = user;
    });
    
    // this.onSectionParentList$.subscribe(data => {
    //   this.sectionParentList = data;
    // });
    
    // this.onFirestoreData().subscribe();
    // this.onLocalData().subscribe();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      logService.error(id); // todo set active one here
    });
  }
  
  ngOnDestroy() { }
  
  public createSectionParent(): SectionParent {
    const data = this.sectionDataService.create();
    this.setOriginalState(data);
    return data;
  }
  
  public getSectionParentList(id?: string): Observable<SectionParentListMergeResolver> {
    return this.sectionDataService.getSectionParentList(id)
      .pipe(tap(data => {
        if (id && data.getFirst()) {
          this.setOriginalState(data.getFirst());
        }
      }))
  }
  
  public getOriginalState(): SectionParent {
    return cloneDeep(this.currentSectionParentOriginalState);
  }
  
  public getOriginalStateSection(uniqueId: number): Section {
    return this.currentSectionParentIdSectionMap.get(uniqueId);
  }

  // public onFirestoreData(): Observable<SectionParentList> {
  //   return this.sectionDataService.onFirestoreData$
  //     .pipe(tap(data => this.mergeSectionParentList(data)));
  // }
  
  // public onLocalData(): Observable<SectionParentList> {
  //   return this.sectionDataService.onLocalData$
  //     .pipe(tap(data => this.mergeSectionParentList(data)));
  // }
  
  // public mergeSectionParentList(list: SectionParentList): void {
  //   let newList: SectionParentList;
  //   if (!list) return;
  //   if (!this.sectionParentList) {
  //     newList = list;
  //   } else {
  //     newList = this.sectionParentList.merge(list); // merge the new and old lists here
  //     // todo: case when item is deleted from list
  //   }
  //   this.onSectionParentList$.next(newList);
    
  //   if (!this.currentSectionParentOriginalState && newList.length()) {
  //     this.setSectionParent(newList.get(0));
  //   }
  // }
  
  public getSectionParent(sectionParent: string) {
    
  }
  
  public setSectionParent(sectionParent: SectionParent): void {
    this.setOriginalState(sectionParent);
    // this.onSectionParent$.next(sectionParent);
  }

  public save(sectionParent: SectionParent): Observable<boolean> {
    return this.sectionDataService.save(sectionParent)
      .pipe(
        tap(data => this.setSectionParent(sectionParent)),
        map(data => true),
        catchError(e => {
          this.logService.error(e);
          return of(false);
        }),
        tap(bool => {
          if (bool) this.notificationsService.pushNotification('Saved successfully!');
          if (!bool) this.notificationsService.pushError('Failed to save, please check logs');
        })
      );
  }
  
  private setOriginalState(sectionParent: SectionParent): void {
    this.currentSectionParentOriginalState = cloneDeep(sectionParent);
    this.currentSectionParentIdSectionMap = new Map();
    this.currentSectionParentOriginalState.forAllDescendents(section => this.currentSectionParentIdSectionMap.set(section.uniqueId, section));
  }
  
  public export(): string {
    return this.sectionDataService.export(this.currentSectionParentOriginalState);
  }
  
  public import(str: string) {
    try {
      const data = this.sectionDataService.import(str);
      this.setSectionParent(data);
      this.notificationsService.pushNotification('Imported data successfully!');
    } catch (e) {
      this.notificationsService.pushError('Could not import data, see log for error');
      this.logService.error(e);
    }
  }
  
}
