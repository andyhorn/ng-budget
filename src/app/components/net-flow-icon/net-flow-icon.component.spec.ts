import { CurrencyPipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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

  it('should return red for net flow less than zero', () => {
    component.netFlow = -1;
    fixture.detectChanges();

    expect(component.colorClass).toEqual('text-danger');
  });

  it('should return green for net flow of zero', () => {
    component.netFlow = 0;
    fixture.detectChanges();

    expect(component.colorClass).toEqual('text-success');
  });

  it('should return green for net flow greater than zero', () => {
    component.netFlow = 1;
    fixture.detectChanges();

    expect(component.colorClass).toEqual('text-success');
  });

  it('should format the net flow as a currency', () => {
    const netFlow = component.netFlow = 100;
    fixture.detectChanges();

    const span = fixture.debugElement.query(By.css('div span'));
    const content = span.nativeElement.innerText;
    const formatted = new CurrencyPipe('en-US').transform(netFlow);

    expect(content).toEqual(formatted);
  });
});
