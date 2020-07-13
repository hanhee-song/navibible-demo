import { zip } from 'rxjs';
import { SectionService } from './../../services/section/section.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { LogService } from './../../logger/log.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BibleDataService } from 'src/app/services/bible/bible-data.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends LogWrapper implements OnInit, OnDestroy {

  public isBibleDataInitialized: boolean = false;
  public isAuthLoaded: boolean = false;

  constructor(
    logService: LogService,
    private bibleDataService: BibleDataService,
    private sectionService: SectionService,
    private auth: AngularFireAuth
  ) {
    super(logService);
  }

  ngOnInit(): void {
    this.sectionService.onSectionsParentList$
      .pipe(takeWhile(res => !res, true))
      .subscribe(data => {
        this.isBibleDataInitialized = true;
      });
    this.bibleDataService.isDataReady$
      .pipe(takeWhile(res => !res, true))
      .subscribe(data => {
        this.isBibleDataInitialized = true;
      })
    const authSub = this.auth.user.subscribe(user => {
      this.isAuthLoaded = true;
      authSub.unsubscribe();
    });
  }

  ngOnDestroy() { }
}
