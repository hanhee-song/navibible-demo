import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  host: {
    'class': 'footer border-color-subtle background-color-default',
  }
})
export class FooterComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit(): void {
  }
}
