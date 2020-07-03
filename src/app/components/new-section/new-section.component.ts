import { remove } from 'lodash';
import { SectionFactory } from './../../services/section/section-factory';
import { Section } from 'src/app/models/section.model';
import { ReferenceFactory } from './../../services/bible/reference-factory';
import { LogService } from './../../logger/log.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MultiRange } from 'src/app/models/multi-range.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'div[app-new-section]',
  templateUrl: './new-section.component.html',
  styleUrls: ['./new-section.component.scss'],
  host: { 'class': 'new-section border-color-subtle' },
  encapsulation: ViewEncapsulation.None,
})
export class NewSectionComponent extends LogWrapper implements OnInit, OnDestroy {

  @Output() onNewSection = new EventEmitter<Section>();
  
  @Input() isFormOpen: boolean = false;
  @Input() showHeader: boolean = true;
  @Input() submitButtonText: string = 'Create';
  @Input() inputName: string = ''
  @Input() multiRanges: MultiRange[];
  public inputMultiRanges: {
    input?: string,
    multiRange?: string,
    error?: boolean
  }[] = [{}];
  @Output() cancel = new EventEmitter<boolean>();

  private referenceFactory: ReferenceFactory;
  private sectionFactory: SectionFactory;

  constructor(
    logService: LogService,
    referenceFactory: ReferenceFactory,
    sectionFactory: SectionFactory
  ) {
    super(logService);
    this.referenceFactory = referenceFactory;
    this.sectionFactory = sectionFactory;
  }

  ngOnInit(): void {
  }
  
  onCancel($event): void {
    event.preventDefault();
    this.isFormOpen = false;
    this.cancel.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['multiRanges']) {
      const multiRanges: MultiRange[] = changes['multiRanges'].currentValue;
      this.inputMultiRanges = multiRanges.map(multiRange => ({
        input: multiRange.toString(),
        multiRange: multiRange.toString()
      }));
    }
  }

  ngOnDestroy(): void { }

  public onAddMultiRange(event) {
    event.preventDefault()
    this.inputMultiRanges.push({});
  }

  public onDeleteMultiRange(multiRange: { input?: string, multiRange?: string, error?: boolean }, event) {
    event.preventDefault();
    this.inputMultiRanges = this.inputMultiRanges.filter(ref => ref !== multiRange);
  }

  public submit(event): void {
    event.preventDefault();
    this.inputMultiRanges.forEach(inputMultiRange => {
      this.onInputReferenceChange(inputMultiRange.input, inputMultiRange);
    });

    if (this.inputMultiRanges.some(inputMultiRange => inputMultiRange.error)) return;
    const multiRange = this.inputMultiRanges.map(inputMultiRange => this.referenceFactory.resolveMultiReference(inputMultiRange.input));
    this.onNewSection.emit(this.sectionFactory.create(this.inputName, multiRange));
    this.inputName = '';
    this.inputMultiRanges = [{}];
    this.multiRanges = [];
  }

  public onInputReferenceChange(input: string, inputMultiRange: { input?: string, multiRange?: string, error?: boolean }) {
    inputMultiRange.input = input;
    let multiRange: MultiRange;
    try {
      multiRange = this.referenceFactory.resolveMultiReference(input);
      inputMultiRange.multiRange = multiRange.toString();
      inputMultiRange.error = false;
    } catch(e) {
      inputMultiRange.multiRange = e;
      inputMultiRange.error = true;
    }
    if (!this.inputMultiRanges.filter(range => !range.input).length) {
      this.inputMultiRanges.push({});
    }
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
}
