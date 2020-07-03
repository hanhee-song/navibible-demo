import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditingBarComponent } from './editing-bar.component';

describe('EditingBarComponent', () => {
  let component: EditingBarComponent;
  let fixture: ComponentFixture<EditingBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditingBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
