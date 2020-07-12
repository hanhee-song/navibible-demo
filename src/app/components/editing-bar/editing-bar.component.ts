import { SectionService } from './../../services/section/section.service';
import { NotificationService } from './../../services/controls/notification.service';
import { ModalService, ModalButton } from './../../services/controls/modal.service';
import { LogService } from './../../logger/log.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { OptionsService } from './../../services/controls/options.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';


@Component({
  selector: 'app-editing-bar',
  templateUrl: './editing-bar.component.html',
  styleUrls: ['./editing-bar.component.scss']
})
export class EditingBarComponent extends LogWrapper implements OnInit, OnDestroy {

  public isEditingMode: boolean = false;
  
  
  constructor(
    logService: LogService,
    private optionsService: OptionsService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private sectionService: SectionService,
    private clipboard: Clipboard
  ) {
    super(logService);
  }

  ngOnInit(): void {
    this.optionsService.isEditingMode$.subscribe(mode => this.isEditingMode = mode);
  }
  
  ngOnDestroy() { }
  
  public onEdit() {
    this.optionsService.setEditingMode(true);
  }

  public onSave(): void {
    this.optionsService.onSave();
  }
  
  public onCancel(): void {
    this.modalService.yesNoModal('Are you sure you want to discard unsaved changes and quit editing?', () => {
      this.optionsService.onCancel();
      this.optionsService.setEditingMode(!this.isEditingMode);
    });
  }
  
  public onUndo(): void {
    this.notificationService.pushError("I haven't implemented this feature yet c:");
  }
  
  public onImport(): void {
    this.modalService.textboxModal('Import saved state here:', data => {
      this.sectionService.import(data);
    })
  }
  
  public onExport(): void {
    const data = this.sectionService.export();
    if (this.copy(data)) {
      this.notificationService.pushNotification('Successfully exported data to clipboard')
    } else {
      this.modalService.customModal('Copy the following text:', data, undefined, ModalButton.greenModal('Close'));
    }
    
  }
  
  private copy(data: string): boolean {
    const pending = this.clipboard.beginCopy(data);
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        // Remember to destroy when you're done!
        pending.destroy();
        if (result) return true;
      }
    };
    return attempt();
  }
}
