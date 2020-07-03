import { Observable } from 'rxjs/internal/Observable';
import { SectionsParent } from './../../models/sections-parent.model';
import { SectionDataService } from './section-data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  private sectionDataService: SectionDataService;

  constructor(
    sectionDataService: SectionDataService
  ) {
    this.sectionDataService = sectionDataService;
  }

  public getSectionsParent(): Observable<SectionsParent> {
    return this.sectionDataService.getSections();
  }

  public save(sectionsParent: SectionsParent): Observable<boolean> {
    return this.sectionDataService.save(sectionsParent);
  }
}
