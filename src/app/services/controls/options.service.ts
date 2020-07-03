import { LogService } from './../../logger/log.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { Subject, BehaviorSubject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptionsService extends LogWrapper implements OnDestroy {
  
  public isEditingMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public lightTheme$: BehaviorSubject<LightThemeEnum> = new BehaviorSubject<LightThemeEnum>(LightThemeEnum.LIGHT);
  public onSave$: Subject<void> = new Subject();
  public onCancel$: Subject<void> = new Subject();
  
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
  DIM = 'dim-mode'
}