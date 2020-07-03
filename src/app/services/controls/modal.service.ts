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
        new ModalButton('No', 'background-color-subtle-red', null),
        new ModalButton('Yes', 'background-color-subtle-green', callback)
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
  }

  public setCloseModal(fn: Function): Modal {
    this.buttons.forEach(button => {
      const onClick: Function = button.onClick;
      button.onClick = () => {
        onClick && onClick(...arguments);
        fn();
      }
    });
    return this;
  }
}

export class ModalButton {
  public text: string;
  public classes: string;
  public onClick: Function; // leave null to make the button close the modal

  constructor(text: string, classes: string, onClick: Function) {
    this.text = text;
    this.classes = classes;
    this.onClick = onClick;
  }
}

export class Modals {
  public modals: Modal[];
  
  constructor() {
    
  }
}