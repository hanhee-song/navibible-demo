import { ModalService, ModalButton } from './../../services/controls/modal.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  host: {
    'class': 'footer border-color-subtle background-color-default',
  }
})
export class FooterComponent implements OnInit {
  
  @ViewChild('tos') tos: TemplateRef<any>;

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
  }
  
  public onTosClick() {
    this.modalService.customModal('', undefined, this.tos, ModalButton.greenModal('Close'));
  }
}