import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TextFieldModule } from '@angular/cdk/text-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SectionComponent } from './components/section/section.component';
import { BibleMainComponent } from './components/bible-main/bible-main.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { NewSectionComponent } from './components/new-section/new-section.component';
import { ModalComponent } from './components/modal/modal.component';
import { EditingBarComponent } from './components/editing-bar/editing-bar.component';
import { SmoothHeightDirective } from './directives/smooth-height.directive';
import { NotificationComponent } from './components/notification/notification.component';

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
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    TextFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
