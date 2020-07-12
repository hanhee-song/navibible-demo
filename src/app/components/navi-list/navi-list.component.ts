import { SectionsParentList } from './../../models/sections-parent-list.model';
import { SectionService } from './../../services/section/section.service';
import { LogService } from './../../logger/log.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-navi-list',
  templateUrl: './navi-list.component.html',
  styleUrls: ['./navi-list.component.scss']
})
export class NaviListComponent extends LogWrapper implements OnInit, OnDestroy {
  
  public sectionParentList: SectionsParentList;

  constructor(
    logService: LogService,
    private sectionService: SectionService
  ) {
    super(logService);
  }

  ngOnInit(): void {
    this.sectionService.onSectionsParentList$
      .pipe(delay(0))
      .subscribe(list => this.sectionParentList = list);
  }

  ngOnDestroy() { }
  
  
}
