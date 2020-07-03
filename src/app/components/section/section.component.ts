import { ModalService } from './../../services/controls/modal.service';
import { LogService } from './../../logger/log.service';
import { Section } from './../../models/section.model';
import { Component, OnInit, Input, OnDestroy, ViewChild, HostBinding, SimpleChanges, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { remove } from 'lodash';

@Component({
  selector: 'div[app-section]',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  host: {
    'class': 'section border-color-default'
  },
  encapsulation: ViewEncapsulation.None
})
export class SectionComponent extends LogWrapper implements OnInit, OnDestroy {

  @Input('section') section: Section;
  @Input('parentSection') parentSection: Section;
  @Input('grandparentSection') grandparentSection: Section;
  @Input('isEditingMode') isEditingMode: boolean;
  @Input('sectionLevel') sectionLevel: number;
  
  public isEdit: boolean;
  
  private modalService: ModalService;

  constructor(
    logService: LogService,
    modalService: ModalService
  ) {
    super(logService);
    this.modalService = modalService;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isEditingMode']) {
      if (changes['isEditingMode'].currentValue === false) {
        this.isEdit = false;
      }
    }
  }

  public toggleExpand(): void {
    this.section.toggleExpand(!this.section.isExpanded);
  }

  public onEdit() {
    this.isEdit = !this.isEdit;
  }

  public onPromote() {
    this.section.flashNew();
    transferArrayItem(
      this.parentSection.sections,
      this.grandparentSection.sections,
      this.parentSection.sections.findIndex(section => section === this.section),
      this.grandparentSection.sections.findIndex(section => section === this.parentSection)
    );
  }

  public onDemote() {
    this.section.flashNew();
    const prevIndex = this.parentSection.sections.findIndex(section => section === this.section)
    let newParentIndex = prevIndex + 1 === this.parentSection.sections.length ? prevIndex - 1 : prevIndex + 1;
    this.parentSection.sections[newParentIndex].isExpanded = true;
    transferArrayItem(
      this.parentSection.sections,
      this.parentSection.sections[newParentIndex].sections,
      prevIndex,
      this.parentSection.sections[newParentIndex].sections.length
    );
  }

  public onDeleteSelf() {
    this.modalService.yesNoModal('Are you sure you want to delete this section?', () => {
      this.parentSection.flashNew();
      this.parentSection.sections = this.parentSection.sections.filter(section => section !== this.section);
    });
  }

  public onNewSection(newSection: Section): void {
    newSection.flashNew();
    this.section.sections.push(newSection); 
  }

  public onUpdateSection(section: Section): void {
    this.section.title = section.title;
    this.section.comment = section.comment;
    this.section.multiRanges = section.multiRanges;
    this.isEdit = false;
  }

  public drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  
  public __trackByFn(index: number, section: Section): number {
    return section.uniqueId;
  }
}
