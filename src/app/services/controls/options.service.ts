import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { LogService } from './../../logger/log.service';

@Injectable({
  providedIn: 'root'
})
export class OptionsService extends LogWrapper implements OnDestroy {
  
  public isEditingMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  public lightTheme$: BehaviorSubject<LightThemeEnum> = new BehaviorSubject<LightThemeEnum>(LightThemeEnum.LIGHT);
  public globalFontSize$: BehaviorSubject<GlobalFontSizeEnum> = new BehaviorSubject<GlobalFontSizeEnum>(GlobalFontSizeEnum.MEDIUM);
  
  public onSave$: Subject<void> = new Subject();
  public onCancel$: Subject<void> = new Subject();
  
  private static readonly LIGHT_THEME_KEY: string = 'LIGHT_THEME';
  private static readonly GLOBAL_FONT_SIZE_KEY: string = 'GLOBAL_FONT_SIZE';

  constructor(
    logService: LogService
  ) {
    super(logService);

    this.setlightTheme(this.get(OptionsService.LIGHT_THEME_KEY) || LightThemeEnum.LIGHT);
    this.setGlobalFontSize(this.get(OptionsService.GLOBAL_FONT_SIZE_KEY) || GlobalFontSizeEnum.MEDIUM);
  }

  ngOnDestroy() { }

  public setlightTheme(mode: LightThemeEnum): void {
    this.save(OptionsService.LIGHT_THEME_KEY, mode);
    this.lightTheme$.next(mode);
  }

  public setGlobalFontSize(size: GlobalFontSizeEnum): void {
    this.save(OptionsService.GLOBAL_FONT_SIZE_KEY, size);
    this.globalFontSize$.next(size);
  }

  public save(key, value): void {
    localStorage.setItem(key, value);
  }

  public get(key): any {
    return localStorage.getItem(key);
  }
  
  public setEditingMode(bool: boolean) {
    this.isEditingMode$.next(bool);
  }
  
  public onSave(): void {
    this.onSave$.next();
  }
  
  public onCancel(): void {
    this.onCancel$.next();
  }
}

export enum LightThemeEnum {
  LIGHT = 'light-mode',
  DARK = 'dark-mode',
  // DIM = 'dim-mode'
}

export enum GlobalFontSizeEnum {
  BIG = 'global-font-size-3',
  MEDIUM = 'global-font-size-2',
  SMALL = 'global-font-size-1'
}