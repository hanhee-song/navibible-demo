import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { MultiRange } from 'src/app/models/multi-range.model';
import { Section } from 'src/app/models/section.model';
import { LogService } from './../../logger/log.service';
import { ReferenceFactory } from './../../services/bible/reference-factory';
import { SectionFactory } from './../../services/section/section-factory';


@Component({
  selector: 'div[app-new-section]',
  templateUrl: './new-section.component.html',
  styleUrls: ['./new-section.component.scss'],
  host: { 'class': 'new-section border-color-subtle' },
  encapsulation: ViewEncapsulation.None,
})
export class NewSectionComponent extends LogWrapper implements OnInit, OnDestroy {
  
  public isFormOpen: boolean = false;
  @Input() openForm: boolean = false;
  @Input() showHeader: boolean = false;
  @Input() submitButtonText: string = 'Create';
  @Input() inputName: string = '';
  @Input() inputComment: string = '';
  @Input() multiRanges: MultiRange[];
  
  @Output() cancel = new EventEmitter<boolean>();
  @Output() onNewSection = new EventEmitter<Section>();
  
  public isTransitioning: boolean = false;
  public inputMultiRanges: {
    input?: string,
    multiRange?: string,
    error?: boolean
  }[] = [{}];
  
  @ViewChild('inputNameField') inputNameField: ElementRef;
  @ViewChild('form') form: ElementRef;

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
  
  onCancel(event): void {
    event.preventDefault();
    if (this.isFormOpen) {
      this.isFormOpen = false;
    }
    // !showHeader means this is an Edit form, which we don't want to clear
    if (!this.showHeader) this.clearFields();
    this.cancel.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['multiRanges'] && changes['multiRanges'].currentValue) {
      const multiRanges: MultiRange[] = changes['multiRanges'].currentValue;
      this.inputMultiRanges = multiRanges.filter(multiRange => !multiRange.isEmpty()).map(multiRange => ({
        input: multiRange.toString(),
        multiRange: multiRange.toString()
      }));
      this.inputMultiRanges.push({});
    }
    if (changes['openForm'] && typeof changes['openForm'].currentValue === 'boolean' && !!changes['openForm'].currentValue !== !!changes['openForm'].previousValue) {
      const openForm = changes['openForm'].currentValue;
      this.onToggleForm(openForm);
    }
  }

  ngOnDestroy(): void { }
  
  public onToggleForm(bool?: boolean): void {
    this.isTransitioning = true;
    setTimeout(() => this.isTransitioning = false, 200);
    setTimeout(() => {
      this.isFormOpen = bool === undefined ? !this.isFormOpen : bool;
      setTimeout(() => {
        if (this.isFormOpen) this.inputNameField.nativeElement.focus();
      }, 1);
    }, 1);
  }

  public onDeleteMultiRange(multiRange: { input?: string, multiRange?: string, error?: boolean }, event): void {
    event.preventDefault();
    this.inputMultiRanges = this.inputMultiRanges.filter(ref => ref !== multiRange);
  }

  public submit(event): void {
    event.preventDefault();
    if (!this.inputName) return;
    this.inputMultiRanges.forEach(inputMultiRange => {
      this.onInputReferenceChange(inputMultiRange.input, inputMultiRange);
    });
    
    if (this.inputMultiRanges.some(inputMultiRange => inputMultiRange.error)) return;
    const multiRange = this.inputMultiRanges.map(inputMultiRange => this.referenceFactory.resolveMultiReference(inputMultiRange.input));
    this.onNewSection.emit(this.sectionFactory.create(this.inputName, this.inputComment, multiRange));
    this.clearFields();
    this.inputNameField.nativeElement.focus();
  }
  
  private clearFields(): void {
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
      setTimeout(() => {
        this.form.nativeElement.scrollTop = this.form.nativeElement.scrollHeight
      }, 1);
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
