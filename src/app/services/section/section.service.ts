import { ActivatedRoute, Routes } from '@angular/router';
import { User } from 'firebase';
import { SectionsParentList } from './../../models/sections-parent-list.model';
import { NotificationService } from './../controls/notification.service';
import { LogService } from './../../logger/log.service';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs/internal/Observable';
import { SectionsParent } from './../../models/sections-parent.model';
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

  public onSectionParent$: BehaviorSubject<SectionsParent> = new BehaviorSubject<SectionsParent>(null);
  public onSectionsParentList$: BehaviorSubject<SectionsParentList> = new BehaviorSubject<SectionsParentList>(null);
  
  private sectionsParentList: SectionsParentList;
  private currentSectionParentOriginalState: SectionsParent;
  private currentSectionParentIdSectionMap: Map<number, Section>;
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
    
    this.onSectionsParentList$.subscribe(data => {
      this.sectionsParentList = data;
    });
    
    this.onFirestoreData().subscribe();
    this.onLocalData().subscribe();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      logService.error(id); // todo set active one here
    });
  }
  
  ngOnDestroy() { }
  
  public getOriginalState(): SectionsParent {
    return cloneDeep(this.currentSectionParentOriginalState);
  }
  
  public getOriginalStateSection(uniqueId: number): Section {
    return this.currentSectionParentIdSectionMap.get(uniqueId);
  }

  public onFirestoreData(): Observable<SectionsParentList> {
    return this.sectionDataService.onFirestoreData$
      .pipe(tap(data => this.mergeSectionParentList(data)));
  }
  
  public onLocalData(): Observable<SectionsParentList> {
    return this.sectionDataService.onLocalData$
      .pipe(tap(data => this.mergeSectionParentList(data)));
  }
  
  public mergeSectionParentList(list: SectionsParentList): void {
    let newList: SectionsParentList;
    if (!list) return;
    if (!this.sectionsParentList) {
      newList = list;
    } else {
      newList = this.sectionsParentList.merge(list); // merge the new and old lists here
    }
    this.onSectionsParentList$.next(newList);
    
    if (!this.currentSectionParentOriginalState && newList.length()) {
      this.setSectionParent(newList.get(0));
    }
  }
  
  public setSectionParent(sectionParent: SectionsParent): void {
    this.setOriginalState(sectionParent);
    this.onSectionParent$.next(sectionParent);
  }

  public save(sectionsParent: SectionsParent): Observable<boolean> {
    return this.sectionDataService.save(sectionsParent)
      .pipe(
        tap(data => this.setSectionParent(sectionsParent)),
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
  
  private setOriginalState(sectionsParent: SectionsParent): void {
    this.currentSectionParentOriginalState = cloneDeep(sectionsParent);
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
