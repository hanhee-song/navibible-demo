import { Observable, Subject, zip } from 'rxjs';
import { flatMap, switchMap, map } from 'rxjs/operators';
import { HttpDataService } from './http-data.service';
import { Injectable } from '@angular/core';
import { Bible } from 'src/app/models/bible';

@Injectable({
  providedIn: 'root'
})
export class BibleDataService {
  
  private httpDataService: HttpDataService;

  private static readonly BIBLE_CHAPTER_VERSE_MAP_PATH: string = 'assets/bible-chapter-verse-map.json';
  private static readonly BIBLE_VERSE_ARR_PATH: string = 'assets/bible-book-map-arr.json';

  private kjv;

  constructor(
    httpDataService: HttpDataService
  ) {
    this.httpDataService = httpDataService;
  }

  public initializeBible(): Observable<boolean> {
    return zip(this.httpDataService.getJson(BibleDataService.BIBLE_VERSE_ARR_PATH), this.httpDataService.getJson(BibleDataService.BIBLE_CHAPTER_VERSE_MAP_PATH))
      .pipe(
        map(data => {
          this.kjv = new Bible(...data);
          return true;
        })
      );
  }
  
  public getBible(): Bible {
    return this.kjv;
  }
}
