import { ModalService } from './../../services/controls/modal.service';
import { LogService } from './../../logger/log.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { OptionsService } from './../../services/controls/options.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-editing-bar',
  templateUrl: './editing-bar.component.html',
  styleUrls: ['./editing-bar.component.scss']
})
export class EditingBarComponent extends LogWrapper implements OnInit, OnDestroy {

  public isVisible: boolean = false;
  
  private optionsService: OptionsService;
  private modalService: ModalService;
  
  constructor(
    logService: LogService,
    optionsService: OptionsService,
    modalService: ModalService
  ) {
    super(logService);
    this.optionsService = optionsService;
    this.modalService = modalService;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = true;
    }, 10);
  }
  
  ngOnDestroy() { }

  public onSave(): void {
    this.optionsService.onSave();
  }
  
  public onCancel(): void {
    this.modalService.yesNoModal('Are you sure you want to discard unsaved changes and revert to last saved state?', () => {
      this.optionsService.onCancel();
    });
  }
}
