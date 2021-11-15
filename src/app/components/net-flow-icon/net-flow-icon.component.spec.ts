import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetFlowIconComponent } from './net-flow-icon.component';

describe('NetFlowIconComponent', () => {
  let component: NetFlowIconComponent;
  let fixture: ComponentFixture<NetFlowIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetFlowIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetFlowIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
