import { NaviListComponent } from './components/navi-list/navi-list.component';
import { BibleMainComponent } from './components/bible-main/bible-main.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';


const routes: Routes = [
  {
    path: 'sections',
    // component: MainComponent,
    children: [
      { path: 'list', component: NaviListComponent },
      { path: ':id', component: BibleMainComponent }
    ]
  },
  { path: '**', component: AppComponent }
  // { path: 'privacy-policy', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
