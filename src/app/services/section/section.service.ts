import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs/internal/Observable';
import { SectionsParent } from './../../models/sections-parent.model';
import { SectionDataService } from './section-data.service';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  private sectionDataService: SectionDataService;
  private originalState: SectionsParent;

  constructor(
    sectionDataService: SectionDataService
  ) {
    this.sectionDataService = sectionDataService;
  }
  
  public getOriginalState(): SectionsParent {
    return cloneDeep(this.originalState);
  }

  public getSectionsParent(): Observable<SectionsParent> {
    return this.sectionDataService.getSections()
      .pipe(tap(data => this.originalState = cloneDeep(data)));
  }

  public save(sectionsParent: SectionsParent): Observable<boolean> {
    return this.sectionDataService.save(sectionsParent)
      .pipe(tap(data => this.originalState = cloneDeep(sectionsParent)));
  }
}
