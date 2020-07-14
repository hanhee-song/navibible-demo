import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionParent } from 'src/app/models/section-parent.model';
import { SectionParentList } from './../../models/section-parent-list.model';
import { SectionService } from './../../services/section/section.service';
import { LogService } from './../../logger/log.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { delay } from 'rxjs/operators';
import { SectionParentListMergeResolver } from 'src/app/models/section-parent-list-merge-resolver.model';

@Component({
  selector: 'app-navi-list',
  templateUrl: './navi-list.component.html',
  styleUrls: ['./navi-list.component.scss']
})
export class NaviListComponent extends LogWrapper implements OnInit, OnDestroy {
  
  public sectionParentList: SectionParentList;
  public sectionParentListMergeResolver: SectionParentListMergeResolver;

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
    // const onSectionParentList = this.sectionService.onSectionParentList$
    //   .pipe(delay(0))
    //   .subscribe(list => this.sectionParentList = list);
    
    // this.subs.push(onSectionParentList);
    const onSectionParentListMergeResolver = this.sectionService.getSectionParentList()
      .subscribe(data => {
        this.sectionParentListMergeResolver = data;
      });
    this.subs.push(onSectionParentListMergeResolver);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
  
  onNavigate(sectionParent: SectionParent): void {
    this.router.navigate(['sections', sectionParent.id]);
  }
  
  onNewProject(): void {
    this.router.navigate(['sections', 'new']);
  }
  
  public trackById(index, conflict) {
    return conflict.id;
  }
}
