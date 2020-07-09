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
        ModalButton.redModal('No'),
        ModalButton.greenModal('Yes', callback)
      ]
    ));
  }
  
  public closeModal(content: string): void {
    this.modals$.next(new Modal(
      content,
      [ModalButton.greenModal('Close')]
    ));
  }
  
  public textboxModal(content: string, callback: Function, text: string = ''): void {
    const buttons = [ModalButton.redModal('Cancel')];
    if (callback) buttons.push(ModalButton.greenModal('Submit', callback))
    this.modals$.next(new Modal(content, buttons, text));
  }
  
  public customModal(content: string, inputText: string, ...modalButtons: ModalButton[]) {
    this.modals$.next(new Modal(content, modalButtons, inputText));
  }
}

export class Modal {
  public content: string;
  public buttons: ModalButton[];
  public isVisible: boolean;
  public isTransitioning: boolean;
  public inputText: string;

  constructor(content: string, buttons: ModalButton[], inputText?: string) {
    this.content = content;
    this.buttons = buttons;
    if (inputText !== undefined) this.inputText = inputText;
  }

  public setCloseModal(fn: Function): Modal {
    this.buttons.forEach(button => {
      const onClick: Function = button.onClick;
      button.onClick = () => {
        if (this.inputText !== undefined && onClick) {
          onClick(this.inputText, ...arguments)
        } else {
          onClick && onClick(...arguments);
        }
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
  
  public static greenModal(text: string, callback?: Function) {
    return new ModalButton(text, 'background-color-subtle-green', callback);
  }
    
  public static redModal(text: string, callback?: Function) {
    return new ModalButton(text, 'background-color-subtle-red', callback);
  }
}