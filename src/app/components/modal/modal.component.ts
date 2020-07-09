import { ModalService } from './../../services/controls/modal.service';
import { LogService } from './../../logger/log.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Modal } from 'src/app/services/controls/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent extends LogWrapper implements OnInit, OnDestroy {
  
  public modals: Modal[] = [];
  @ViewChildren('modalButton') modalButtons: QueryList<ElementRef>;

  constructor(
    logService: LogService,
    modalService: ModalService
  ) {
    super(logService);
    modalService.modals$.subscribe(modal => {
      modal.isTransitioning = true;
      setTimeout(() => {
        modal.isVisible = true;
        this.modalButtons.last.nativeElement.focus();
      }, 1);
      this.modals.push(modal.setCloseModal(this.closeModal(modal)));
      
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() { }
  
  public closeModal(modal: Modal): Function {
    return () => {
      modal.isTransitioning = true;
      modal.isVisible = false;
      setTimeout(() => {
        this.modals = this.modals.filter(m => m !== modal);
      }, 200);
    };
  }
}
