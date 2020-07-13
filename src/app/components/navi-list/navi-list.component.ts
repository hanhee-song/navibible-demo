import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionsParent } from 'src/app/models/sections-parent.model';
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

  private subs: Subscription[] = [];
  
  constructor(
    logService: LogService,
    private sectionService: SectionService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(logService);
  }

  ngOnInit(): void {
    const onSectionsParentList = this.sectionService.onSectionsParentList$
      .pipe(delay(0))
      .subscribe(list => this.sectionParentList = list);
    this.subs.push(onSectionsParentList);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
  
  onNavigate(sectionParent: SectionsParent): void {
    this.router.navigate(['sections', sectionParent.id]);
  }
}
