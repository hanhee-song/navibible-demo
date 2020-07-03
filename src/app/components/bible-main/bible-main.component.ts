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
  private sectionService: SectionService;

  constructor(
    sectionService: SectionService,
    logService: LogService
  ) {
    super(logService);
    this.sectionService = sectionService;
  }

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
  }

  public save() {
    this.sectionService.save(this.sectionsParent).subscribe();
  }

  private initializeData() {
    this.sectionService.getSectionsParent()
      .subscribe(data => {
        console.log(data);
        this.sectionsParent = data;
      });
  }
}
