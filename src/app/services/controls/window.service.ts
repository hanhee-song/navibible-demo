import { HostListener, Injectable, OnDestroy } from '@angular/core';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { LogService } from './../../logger/log.service';

@Injectable({
  providedIn: 'root'
})
export class WindowService extends LogWrapper implements OnDestroy {
  private innerWidth: any;

  constructor(
    logService: LogService
  ) {
    super(logService);
  }
  
  ngOnInit() {
    this.innerWidth = window.innerWidth;
  }
  
  ngOnDestroy() { }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
}
