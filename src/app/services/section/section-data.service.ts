import { cloneDeep } from 'lodash';
import { LogService } from './../../logger/log.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { SectionFactory } from './section-factory';
import { Injectable, OnDestroy } from '@angular/core';
import { SectionsParentInterface, SectionsParent } from 'src/app/models/sections-parent.model';
import { of, Observable } from 'rxjs';
import { compress, decompress, encodeBase64, decodeBase64 } from 'lzutf8';

@Injectable({
  providedIn: 'root'
})
export class SectionDataService extends LogWrapper implements OnDestroy {

  constructor(
    logService: LogService,
    private sectionFactoryService: SectionFactory
  ) {
    super(logService);
  }

  ngOnDestroy() { }

  public getSections(): Observable<SectionsParent> {
    const data: SectionsParentInterface = JSON.parse(localStorage.getItem('sectionsParentData'));
    return of(this.sectionFactoryService.fromSectionsParentJson(data || {}));
  }

  public save(sectionsParent: SectionsParent): Observable<boolean> {
    const clone: SectionsParent = cloneDeep(sectionsParent);
    clone.forAllDescendents(section => section.clearUnsavedFields());
    try {
      const str = JSON.stringify(clone);
      localStorage.setItem('sectionsParentData', str);
      return of(true);
    } catch(e) {
      return of(e);
    }
  }
  
  public export(sectionsParent: SectionsParent): string {
    const clone: SectionsParent = cloneDeep(sectionsParent);
    clone.forAllDescendents(section => section.clearUnsavedFields());
    return encodeBase64(compress(JSON.stringify(clone)));
    // return JSON.stringify(clone);
  }
  
  public import(str: string): SectionsParent {
    // return JSON.parse(str);
    const data = decompress(decodeBase64(str))
    return this.sectionFactoryService.fromSectionsParentJson(JSON.parse(data) || {});
  }
}