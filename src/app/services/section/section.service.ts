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

@Injectable({
  providedIn: 'root'
})
export class SectionService extends LogWrapper implements OnDestroy {

  public onSectionParent$: BehaviorSubject<SectionsParent> = new BehaviorSubject<SectionsParent>(null);
  
  private originalState: SectionsParent;
  private idSectionMap: Map<number, Section>;
  private sectionsParent: SectionsParent;

  constructor(
    logService: LogService,
    private sectionDataService: SectionDataService,
    private notificationsService: NotificationService
  ) {
    super(logService);
    this.initSectionsParent().subscribe(data => this.setSectionParent(data));
  }
  
  ngOnDestroy() { }
  
  public getOriginalState(): SectionsParent {
    return cloneDeep(this.originalState);
  }
  
  public getOriginalStateSection(uniqueId: number): Section {
    return this.idSectionMap.get(uniqueId);
  }

  private initSectionsParent(): Observable<SectionsParent> {
    return this.sectionDataService.getSections()
      .pipe(tap(data => this.setSectionParent(data)));
  }
  
  public setSectionParent(sectionParent: SectionsParent) {
    this.setOriginalState(sectionParent);
    return this.onSectionParent$.next(sectionParent);
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
    this.originalState = cloneDeep(sectionsParent);
    this.idSectionMap = new Map();
    this.originalState.forAllDescendents(section => this.idSectionMap.set(section.uniqueId, section));
  }
  
  public export(): string {
    return this.sectionDataService.export(this.originalState);
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
