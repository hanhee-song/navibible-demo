import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaviListComponent } from './navi-list.component';

describe('NaviListComponent', () => {
  let component: NaviListComponent;
  let fixture: ComponentFixture<NaviListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaviListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaviListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
