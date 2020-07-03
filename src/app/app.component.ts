import { OptionsService, LightThemeEnum } from './services/controls/options.service';
import { SidenavService } from './services/controls/sidenav.service';
import { LogService } from './logger/log.service';
import { Verse } from './models/verse.model';
import { BibleDataService } from './services/bible/bible-data.service';
import { Component, OnDestroy } from '@angular/core';
import { LogWrapper } from './logger/log-wrapper';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '[class]': 'lightTheme',
  }
})
export class AppComponent extends LogWrapper implements OnDestroy {

  public isBibleDataInitialized: boolean = false;
  public lightTheme: LightThemeEnum;

  public optionsService: OptionsService;

  constructor(
    bibleDataService: BibleDataService,
    logService: LogService,
    optionsService: OptionsService
  ) {
    super(logService);
    bibleDataService.initializeBible()
      .subscribe(data => {
        this.isBibleDataInitialized = true;
      });
    this.optionsService = optionsService;

    this.optionsService.lightTheme$.subscribe(mode => this.lightTheme = mode);
  }

  ngOnDestroy() { }
}
