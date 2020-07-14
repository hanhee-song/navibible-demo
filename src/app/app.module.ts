import { DateAgoPipe } from './utils/date-ago-pipe.pipe';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TextFieldModule } from '@angular/cdk/text-field';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BibleMainComponent } from './components/bible-main/bible-main.component';
import { EditingBarComponent } from './components/editing-bar/editing-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import { NewSectionComponent } from './components/new-section/new-section.component';
import { NotificationComponent } from './components/notification/notification.component';
import { SectionComponent } from './components/section/section.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { NgVarDirective } from './directives/ng-var.directive';
import { SmoothHeightDirective } from './directives/smooth-height.directive';

// import { FirebaseUIModule } from 'firebaseui-angular';
// import * as firebase from 'firebase/app';
// import * as firebaseui from 'firebaseui';
// // currently there is a bug while building the app with --prod
// // - https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/76
// // the plugin exposes the two libraries as well. You can use those:
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { NaviListComponent } from './components/navi-list/navi-list.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MainComponent } from './components/main/main.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LoginComponent } from './components/login/login.component';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // {
    //   scopes: [
    //     'public_profile',
    //     'email',
    //     'user_likes',
    //     'user_friends'
    //   ],
    //   customParameters: {
    //     'auth_type': 'reauthenticate'
    //   },
    //   provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID
    // },
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID
    },
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ],
  // tosUrl: '<your-tos-link>',
  privacyPolicyUrl: 'https://www.privacypolicies.com/generic/',
  credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
};


@NgModule({
  declarations: [
    AppComponent,
    SectionComponent,
    BibleMainComponent,
    SidenavComponent,
    TopnavComponent,
    NewSectionComponent,
    ModalComponent,
    EditingBarComponent,
    SmoothHeightDirective,
    NotificationComponent,
    NgVarDirective,
    FooterComponent,
    NaviListComponent,
    LoadingComponent,
    MainComponent,
    DateAgoPipe,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    TextFieldModule,
    ClipboardModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    AngularFirestoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
