import { Component, OnDestroy } from '@angular/core';
import { LogWrapper } from './logger/log-wrapper';
import { LogService } from './logger/log.service';
import { BibleDataService } from './services/bible/bible-data.service';
import { GlobalFontSizeEnum, LightThemeEnum, OptionsService } from './services/controls/options.service';

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
  public globalFontSize: GlobalFontSizeEnum;
  public isEditingMode: boolean = false;
  
  private optionsService: OptionsService;

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
    this.optionsService.globalFontSize$.subscribe(size => this.globalFontSize = size);
    this.optionsService.isEditingMode$.subscribe(editingMode => this.isEditingMode = editingMode);
  }

  ngOnDestroy() { }
}
