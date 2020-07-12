import { Injectable, OnDestroy, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { LogService } from './../../logger/log.service';

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
  
  public customModal(content: string, inputText: string, templateRef: TemplateRef<any>, ...modalButtons: ModalButton[]) {
    this.modals$.next(new Modal(content, modalButtons, inputText, templateRef));
  }
}

export class Modal {
  public content: string;
  public buttons: ModalButton[];
  public isVisible: boolean;
  public isTransitioning: boolean;
  public inputText: string;
  public templateRef: TemplateRef<any>;
  

  constructor(content: string, buttons: ModalButton[], inputText?: string, templateRef?: TemplateRef<any>) {
    this.content = content;
    this.buttons = buttons;
    this.inputText = inputText;
    this.templateRef = templateRef;
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
    return new ModalButton(text, 'background-color-subtle-green hoverable', callback);
  }
    
  public static redModal(text: string, callback?: Function) {
    return new ModalButton(text, 'background-color-subtle-red hoverable', callback);
  }
}