import { AngularFireAuth } from '@angular/fire/auth';
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

  public lightTheme: LightThemeEnum;
  public globalFontSize: GlobalFontSizeEnum;
  
  constructor(
    logService: LogService,
    private optionsService: OptionsService,
  ) {
    super(logService);
  }
  
  ngOnInit(): void {
    this.optionsService.lightTheme$.subscribe(mode => this.lightTheme = mode);
    this.optionsService.globalFontSize$.subscribe(size => this.globalFontSize = size);
  }

  ngOnDestroy() { }
}
