import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs/internal/Observable';
import { SectionsParent } from './../../models/sections-parent.model';
import { SectionDataService } from './section-data.service';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Section } from 'src/app/models/section.model';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  private sectionDataService: SectionDataService;
  private originalState: SectionsParent;
  private idSectionMap: Map<number, Section>;

  constructor(
    sectionDataService: SectionDataService
  ) {
    this.sectionDataService = sectionDataService;
  }
  
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
      .pipe(tap(data => this.setOriginalState(sectionsParent)));
  }
  
  private setOriginalState(sectionsParent: SectionsParent): void {
    this.originalState = cloneDeep(sectionsParent);
    this.idSectionMap = new Map();
    this.originalState.forAllDescendents(section => this.idSectionMap.set(section.uniqueId, section));
  }
}
