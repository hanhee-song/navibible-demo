import { Injectable, OnDestroy } from '@angular/core';
import { Observable, zip, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { Bible } from 'src/app/models/bible';
import { LogService } from './../../logger/log.service';
import { HttpDataService } from './http-data.service';

@Injectable({
  providedIn: 'root'
})
export class BibleDataService extends LogWrapper implements OnDestroy {
  
  private static readonly BIBLE_CHAPTER_VERSE_MAP_PATH: string = 'assets/bible-chapter-verse-map.json';
  // private static readonly BIBLE_VERSE_ARR_PATH: string = 'assets/bible-book-map-arr.json';
  private static readonly BIBLE_VERSE_ARR_PATH: string = 'assets/bible-arr.json';
  
  public isDataReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private kjv;

  constructor(
    logService: LogService,
    private httpDataService: HttpDataService
  ) {
    super(logService);
    
    this.initializeBible();
  }
  
  ngOnDestroy() { }

  public initializeBible(): void {
    zip(this.httpDataService.getJson(BibleDataService.BIBLE_VERSE_ARR_PATH), this.httpDataService.getJson(BibleDataService.BIBLE_CHAPTER_VERSE_MAP_PATH))
      .pipe(
        map(data => {
          this.kjv = new Bible(...data);
          this.isDataReady$.next(true);
          return true;
        })
      ).subscribe()
  }
  
  public getBible = (): Bible => {
    return this.kjv;
  }
}
