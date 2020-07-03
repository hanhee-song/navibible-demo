import { LogService } from './../../logger/log.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptionsService extends LogWrapper implements OnDestroy {
  public lightTheme$: BehaviorSubject<LightThemeEnum> = new BehaviorSubject<LightThemeEnum>(LightThemeEnum.LIGHT);
  private lightTheme: LightThemeEnum;
  private static readonly LIGHT_THEME_KEY: string = 'LIGHT_THEME';

  constructor(
    logService: LogService
  ) {
    super(logService);

    this.lightTheme$.subscribe(mode => this.lightTheme = mode);
    this.setlightTheme(this.get(OptionsService.LIGHT_THEME_KEY) || LightThemeEnum.LIGHT);
  }

  ngOnDestroy() { }

  public setlightTheme(mode: LightThemeEnum): void {
    this.save(OptionsService.LIGHT_THEME_KEY, mode);
    this.lightTheme$.next(mode);
  }

  public save(key, value): void {
    localStorage.setItem(key, value);
  }

  public get(key): any {
    return localStorage.getItem(key);
  }
}

export enum LightThemeEnum {
  LIGHT = 'light-mode',
  DARK = 'dark-mode',
  DIM = 'dim-mode'
}