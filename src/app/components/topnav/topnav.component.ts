import { NotificationService } from './../../services/controls/notification.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { LogService } from 'src/app/logger/log.service';
import { ModalService } from './../../services/controls/modal.service';
import { OptionsService } from './../../services/controls/options.service';
import {FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult} from 'firebaseui-angular';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent extends LogWrapper implements OnInit, OnDestroy {
  
  constructor(
    logService: LogService,
  ) {
    super(logService);
  }

  ngOnInit(): void {
  }
  
  ngOnDestroy() { }
}
