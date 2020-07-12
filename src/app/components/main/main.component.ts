import { SectionService } from './../../services/section/section.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { LogService } from './../../logger/log.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BibleDataService } from 'src/app/services/bible/bible-data.service';
import { AngularFireAuth } from '@angular/fire/auth';

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
    this.bibleDataService.initializeBible()
      .subscribe(data => {
        // this.isBibleDataInitialized = true
        this.sectionService.initSectionsParentList()
          .subscribe(d => this.isBibleDataInitialized = true);
      });
    this.auth.authState.subscribe(user => this.isAuthLoaded = true);
  }

  ngOnDestroy() { }
}
