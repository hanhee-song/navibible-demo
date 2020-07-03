import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BibleMainComponent } from './bible-main.component';

describe('BibleMainComponent', () => {
  let component: BibleMainComponent;
  let fixture: ComponentFixture<BibleMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BibleMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BibleMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
