import { NotificationService } from './../../services/controls/notification.service';
import { OptionsService } from './../../services/controls/options.service';
import { LogService } from './../../logger/log.service';
import { SectionService } from './../../services/section/section.service';
import { SectionsParentInterface, SectionsParent } from './../../models/sections-parent.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogWrapper } from 'src/app/logger/log-wrapper';

@Component({
  selector: 'app-bible-main',
  templateUrl: './bible-main.component.html',
  styleUrls: ['./bible-main.component.scss']
})
export class BibleMainComponent extends LogWrapper implements OnInit, OnDestroy {

  public sectionsParent: SectionsParent;
  public isEditingMode: boolean;
  
  constructor(
    logService: LogService,
    private sectionService: SectionService,
    private optionsService: OptionsService,
    private notificationService: NotificationService
  ) {
    super(logService);
  }

  ngOnInit(): void {
    this.sectionService.onSectionParent$.subscribe(sectionParent => {
      this.sectionsParent = sectionParent;
    });
    this.optionsService.isEditingMode$.subscribe(editingMode => this.isEditingMode = editingMode);
    this.optionsService.onSave$.subscribe(val => {
      this.save();
    });
    this.optionsService.onCancel$.subscribe(cancel => {
      this.sectionsParent = this.sectionService.getOriginalState();
      this.notificationService.pushNotification('Changes have been discarded');
    });
  }

  ngOnDestroy(): void {
  }

  public save() {
    this.sectionService.save(this.sectionsParent).subscribe();
  }
}
