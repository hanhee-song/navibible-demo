import { Component, OnDestroy, OnInit } from '@angular/core';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { LogService } from 'src/app/logger/log.service';
import { OptionsService } from './../../services/controls/options.service';
import { SidenavService } from 'src/app/services/controls/sidenav.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent extends LogWrapper implements OnInit, OnDestroy {
  
  public isEditingMode: boolean;
  public isSidenavOpen: boolean;
  
  constructor(
    logService: LogService,
    private optionsService: OptionsService,
    private sidenavService: SidenavService
    
  ) {
    super(logService);
  }

  ngOnInit(): void {
    this.optionsService.isEditingMode$.subscribe(data => {
      this.isEditingMode = data;
    });
    this.sidenavService.isOpen$.subscribe(isOpen => this.isSidenavOpen = isOpen);
  }
  
  ngOnDestroy() { }
  
  
  public toggleSidenav(): void {
    this.sidenavService.toggleSidenav();
  }

}
