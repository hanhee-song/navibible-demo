import { LogService } from './../../logger/log.service';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService extends LogWrapper implements OnDestroy {

  public modals$ = new Subject<Modal>();

  constructor(
    logService: LogService
  ) {
    super(logService);
  }

  ngOnDestroy() { }

  public yesNoModal(content: string, callback: Function): void {
    this.modals$.next(new Modal(
      content,
      [
        new ModalButton('Yes', '', callback),
        new ModalButton('Cancel', '', null)
      ]
    ));
  }
}

export class Modal {
  public content: string;
  public buttons: ModalButton[];

  constructor(content: string, buttons: ModalButton[]) {
    this.content = content;
    this.buttons = buttons;

    this.buttons.forEach(button => {
      if (button.onPress === null) {
        button.onPress = this.closeModal;
      }
    });
  }

  public closeModal() {
    ///
  }
}

export class ModalButton {
  public text: string;
  public classes: string;
  public onPress: Function;

  constructor(text: string, classes: string, onPress: Function) {
    this.text = text;
    this.classes = classes;
    this.onPress = onPress;
  }
}