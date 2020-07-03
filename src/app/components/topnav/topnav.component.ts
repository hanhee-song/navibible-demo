import { LogWrapper } from 'src/app/logger/log-wrapper';
import { ModalService } from './../../services/controls/modal.service';
import { OptionsService } from './../../services/controls/options.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from 'src/app/logger/log.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent extends LogWrapper implements OnInit, OnDestroy {

  private optionsService: OptionsService;
  private isEditingMode: boolean;
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
    this.optionsService.isEditingMode$.subscribe(bool => this.isEditingMode = bool);
  }
  
  ngOnDestroy() { }

  public onEdit() {
    if (this.isEditingMode) {
      this.modalService.yesNoModal('Are you sure you want to discard unsaved changes and quit editing?', () => {
        this.optionsService.onCancel();
        this.optionsService.setEditingMode(!this.isEditingMode);
      });
    } else {
      this.optionsService.setEditingMode(!this.isEditingMode);
    }
  }
}
