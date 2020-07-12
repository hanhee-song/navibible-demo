import { Component, OnDestroy, OnInit } from '@angular/core';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { LogService } from './../../logger/log.service';
import { GlobalFontSizeEnum, LightThemeEnum, OptionsService } from './../../services/controls/options.service';
import { SidenavService } from './../../services/controls/sidenav.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { NotificationService } from 'src/app/services/controls/notification.service';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUISignInFailure } from 'firebaseui-angular';

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
  
  public isSigninDropdownOpen: boolean;
  public user = null;

  public drawers: { [key: string]: boolean } = {};

  constructor(
    logService: LogService,
    private sidenavService: SidenavService,
    private optionsService: OptionsService,
    private auth: AngularFireAuth,
    private notificationService: NotificationService
  ) {
    super(logService);
  }

  ngOnInit(): void {
    this.auth.authState.subscribe(user => this.user = user);
    this.optionsService.lightTheme$.subscribe(theme => this.lightTheme = theme);
    this.optionsService.globalFontSize$.subscribe(size => this.globalFontSize = size);
    
    this.sidenavService.isOpen$.subscribe(isOpen => {
      if (this.isOpen !== isOpen) {
        this.isTransitioning = true;
        setTimeout(() => this.isTransitioning = false, 200);
      }
      setTimeout(() => this.isOpen = isOpen, 1)
    });
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
  
  public signout() {
    this.auth.signOut();
    this.isSigninDropdownOpen = false;
  }
  
  public onSignIn(data: FirebaseUISignInSuccessWithAuthResult) {
    this.isSigninDropdownOpen = false;
  }
  
  public onSignInError(data: FirebaseUISignInFailure) {
    this.notificationService.pushError('Failed to sign in');
    this.logService.error(data);
    this.isSigninDropdownOpen = false;
  }
}
