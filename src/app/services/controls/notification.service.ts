import { LogService } from './../../logger/log.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends LogWrapper implements OnDestroy {

  public notifications$ = new Subject<Notification>();
  
  constructor(
    logService: LogService
  ) {
    super(logService);
  }
  
  ngOnDestroy() { }
  
  public pushNotification(str: string) {
    this.notifications$.next(new Notification(str, 'background-color-green'));
  }
  
  public pushError(str: string) {
    this.notifications$.next(new Notification(str, 'error'));
  }
}

export class Notification {
  public text: string;
  public cssClass: string;
  
  constructor(text: string, cssClass: string) {
    this.text = text;
    this.cssClass = cssClass;
  }
}