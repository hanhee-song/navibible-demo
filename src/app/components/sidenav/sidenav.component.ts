import { Component, OnDestroy, OnInit } from '@angular/core';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { LogService } from './../../logger/log.service';
import { GlobalFontSizeEnum, LightThemeEnum, OptionsService } from './../../services/controls/options.service';
import { SidenavService } from './../../services/controls/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent extends LogWrapper implements OnInit, OnDestroy {

  public isOpen: boolean;
  public lightTheme: LightThemeEnum;
  public LightThemeEnum = LightThemeEnum;
  public globalFontSize: GlobalFontSizeEnum;
  public GlobalFontSizeEnum = GlobalFontSizeEnum;
  public isTransitioning: boolean = false;

  public drawers: { [key: string]: boolean } = {};

  private sidenavService: SidenavService;
  private optionsService: OptionsService;
  
  constructor(
    logService: LogService,
    sidenavService: SidenavService,
    optionsService: OptionsService
  ) {
    super(logService);
    sidenavService.isOpen$.subscribe(isOpen => {
      if (this.isOpen !== isOpen) {
        this.isTransitioning = true;
        setTimeout(() => this.isTransitioning = false, 200);
      }
      setTimeout(() => this.isOpen = isOpen, 1)
    });
    this.sidenavService = sidenavService;
    this.optionsService = optionsService;
    this.optionsService.lightTheme$.subscribe(theme => this.lightTheme = theme);
    this.optionsService.globalFontSize$.subscribe(size => this.globalFontSize = size);
  }

  ngOnInit(): void {
  }

  ngOnDestroy() { }

  public togglelightTheme(mode: LightThemeEnum): void {
    this.optionsService.setlightTheme(mode);
  }
  
  public toggleGlobalFontSize(size: GlobalFontSizeEnum): void {
    this.optionsService.setGlobalFontSize(size);
  }

  public toggleSidenav(): void {
    this.sidenavService.toggleSidenav();
  }

  public closeSidenav(): void {
    this.sidenavService.closeSidenav();
  }
}
