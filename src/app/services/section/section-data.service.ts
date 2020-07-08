import { LogService } from './../../logger/log.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { AppComponent } from './../../app.component';
import { SectionFactory } from './section-factory';
import { Injectable, OnDestroy } from '@angular/core';
import { SectionsParentInterface, SectionsParent } from 'src/app/models/sections-parent.model';
import { of, Observable } from 'rxjs';

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
    const sectionsJson = sectionJsonExample;
    
    return this.fromJson(sectionsJson);
  }

  private fromJson(json): Observable<SectionsParent> {
    // return of(this.sectionFactoryService.fromSectionsParentJson(json));
    const data: SectionsParentInterface = JSON.parse(localStorage.getItem('sectionsParentData'));
    return of(this.sectionFactoryService.fromSectionsParentJson(data || {}));
  }

  public save(sectionsParent: SectionsParent): Observable<boolean> {
    const str = JSON.stringify(sectionsParent);
    localStorage.setItem('sectionsParentData', str);
    return of(true);
  }
}


const sectionJsonExample = {
  "author": "Hanhee Song",
  "date": "2020-06-03",
  "sections": [
    {
      "title": "Genesis",
      "description": "___",
      "sectionType": "BOOK",
      // "fromVerseId": 1,
      // "toVerseId": 1533,
      "sections": [
        {
          "title": "Creation and Fall",
          "description": "Description",
          "sectionType": "SECTION",
          "sections": [
            {
              "title": "Creation and Fall",
              "sectionType": "SUBSECTION",
              // "fromVerseId": 1,
              // "toVerseId": 56
            }
          ]
        },
        {
          "title": "The Patriarchs",
          "description": "Description",
          "sectionType": "SECTION",
          "sections": [
          ]
        }
      ]
    }
  ]
}
