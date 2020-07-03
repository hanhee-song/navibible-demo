import { LogService } from './../../logger/log.service';
import { Injectable, OnDestroy } from '@angular/core';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService extends LogWrapper implements OnDestroy {
  public isOpen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isOpen: boolean;

  constructor(
    logService: LogService
  ) {
    super(logService);
    this.isOpen$.subscribe(isOpen => this.isOpen = isOpen);
  }

  ngOnDestroy() { }

  public openSidenav() {
    this.isOpen$.next(true);
  }

  public closeSidenav() {
    this.isOpen$.next(false);
  }

  public toggleSidenav() {
    this.isOpen$.next(!this.isOpen);
  }
}
