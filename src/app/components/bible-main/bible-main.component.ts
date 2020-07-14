import { Subscription } from 'rxjs';
import { NotificationService } from './../../services/controls/notification.service';
import { OptionsService } from './../../services/controls/options.service';
import { LogService } from './../../logger/log.service';
import { SectionService } from './../../services/section/section.service';
import { SectionParentInterface, SectionParent } from './../../models/section-parent.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-bible-main',
  templateUrl: './bible-main.component.html',
  styleUrls: ['./bible-main.component.scss']
})
export class BibleMainComponent extends LogWrapper implements OnInit, OnDestroy {

  public sectionParent: SectionParent = undefined;
  public isEditingMode: boolean;
  private subs: Subscription[] = [];
  private isNew: boolean;
  
  constructor(
    logService: LogService,
    private sectionService: SectionService,
    private optionsService: OptionsService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(logService);
  }
  
  ngOnInit(): void {
    const route = this.route.paramMap.subscribe(map => {
      const id = map.get('id');
      if (id === 'new') {
        this.sectionParent = this.sectionService.createSectionParent();
        // this.router.navigate(['sections', this.sectionParent.id], { replaceUrl: true });
        setTimeout(() => {
          this.optionsService.setEditingMode(true);
        }, 1);
        this.isNew = true;
      } else {
        this.optionsService.setEditingMode(false);
        const onSectionParentListMergeResolver = this.sectionService.getSectionParentList(id)
          .subscribe(data => {
            this.sectionParent = data.getFirst() || null;
            if (this.sectionParent && this.sectionParent.sections.length === 0) {
              this.optionsService.setEditingMode(true);
            }
          });
          this.subs.push(onSectionParentListMergeResolver);
      }
    });
    
    // this.sectionService.onSectionParent$.subscribe(sectionParent => {
    //   this.sectionParent = sectionParent;
    // })
    
    // const onSectionParent = this.sectionService.onSectionParent$.subscribe(sectionParent => this.sectionParent = sectionParent);
    const isEditingMode = this.optionsService.isEditingMode$.subscribe(editingMode => this.isEditingMode = editingMode);
    const onSave = this.optionsService.onSave$.subscribe(val => this.save());
    const onCancel = this.optionsService.onCancel$.subscribe(cancel => {
      if (this.isNew) {
        this.router.navigate(['sections', 'list']);
      } else {
        this.sectionParent = this.sectionService.getOriginalState();
        this.notificationService.pushNotification('Changes have been discarded');
      }
    });
    this.subs.push(isEditingMode, onSave, onCancel, route);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.optionsService.setEditingMode(false);
  }

  public save() {
    this.sectionService.save(this.sectionParent).subscribe(r => {
      if (this.isNew) {
        this.router.navigate(['sections', this.sectionParent.id], { replaceUrl: true });
      }
    });
  }
}
