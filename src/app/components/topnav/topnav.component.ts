import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { LogService } from 'src/app/logger/log.service';
import { ModalService } from './../../services/controls/modal.service';
import { OptionsService } from './../../services/controls/options.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent extends LogWrapper implements OnInit, OnDestroy {

  public isSigninDropdownOpen: boolean;
  public user: SocialUser;
  private isEditingMode: boolean;
  
  constructor(
    logService: LogService,
    private optionsService: OptionsService,
    private modalService: ModalService,
    private authService: SocialAuthService
  ) {
    super(logService);
  }

  ngOnInit(): void {
    this.optionsService.isEditingMode$.subscribe(bool => this.isEditingMode = bool);
    
    this.authService.authState.subscribe(user => {
      this.user = user;
    });
  }
  
  ngOnDestroy() { }

  public onEdit() {
    if (this.isEditingMode) {
      this.modalService.yesNoModal('Are you sure you want to discard unsaved changes and quit editing?', () => {
        this.optionsService.onCancel();
        this.optionsService.setEditingMode(!this.isEditingMode);
      });
    } else {
      this.optionsService.setEditingMode(!this.isEditingMode);
    }
  }
  
  public signinWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.isSigninDropdownOpen = false;
  }
  
  public signout(): void {
    this.authService.signOut();
    this.isSigninDropdownOpen = false;
  }
}
