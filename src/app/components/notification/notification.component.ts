import { LogWrapper } from 'src/app/logger/log-wrapper';
import { Notification, NotificationService } from './../../services/controls/notification.service';
import { LogService } from './../../logger/log.service';
import { Component, OnInit, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent extends LogWrapper implements OnInit, OnDestroy {
  
  public notifications: Notification[] = [];

  constructor(
    logService: LogService,
    private notificationService: NotificationService
  ) {
    super(logService);
    notificationService.notifications$.subscribe(notification => {
      this.notifications.push(notification);
      const cssClasses = notification.cssClass;
      setTimeout(() => {
        notification.cssClass = cssClasses + ' is-appearing';
      }, 1);
      setTimeout(() => {
        notification.cssClass = cssClasses + ' is-fading';
      }, 4000);
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n !== notification);
      }, 5000);
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() { }
  
  
}
