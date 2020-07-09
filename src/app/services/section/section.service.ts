import { NotificationService } from './../controls/notification.service';
import { LogService } from './../../logger/log.service';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs/internal/Observable';
import { SectionsParent } from './../../models/sections-parent.model';
import { SectionDataService } from './section-data.service';
import { Injectable, OnDestroy } from '@angular/core';
import { tap, map, catchError } from 'rxjs/operators';
import { Section } from 'src/app/models/section.model';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectionService extends LogWrapper implements OnDestroy {

  private originalState: SectionsParent;
  private idSectionMap: Map<number, Section>;

  constructor(
    logService: LogService,
    private sectionDataService: SectionDataService,
    private notificationsService: NotificationService
  ) {
    super(logService);
  }
  
  ngOnDestroy() { }
  
  public getOriginalState(): SectionsParent {
    return cloneDeep(this.originalState);
  }
  
  public getOriginalStateSection(uniqueId: number): Section {
    return this.idSectionMap.get(uniqueId);
  }

  public getSectionsParent(): Observable<SectionsParent> {
    return this.sectionDataService.getSections()
      .pipe(tap(data => this.setOriginalState(data)));
  }

  public save(sectionsParent: SectionsParent): Observable<boolean> {
    return this.sectionDataService.save(sectionsParent)
      .pipe(
        tap(data => this.setOriginalState(sectionsParent)),
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
}
