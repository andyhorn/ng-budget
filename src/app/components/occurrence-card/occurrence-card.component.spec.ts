import { CurrencyPipe, DatePipe } from '@angular/common';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { Occurrence } from 'src/app/models/occurrence';
import { RunningTotal } from 'src/app/models/running-total';
import { Transaction } from 'src/app/models/transaction';
import { AppStateService } from 'src/app/services/state/app-state.service';
import { NetFlowIconComponent } from '../net-flow-icon/net-flow-icon.component';

import { OccurrenceCardComponent } from './occurrence-card.component';

// class MockState {}

describe('OccurenceCardComponent', () => {
  let component: OccurrenceCardComponent;
  let fixture: ComponentFixture<OccurrenceCardComponent>;
  let occurrenceDate: Date;
  const occurrenceIndex: number = 0;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OccurrenceCardComponent, NetFlowIconComponent ],
      imports: [
        MatCardModule,
        MatTableModule,
      ],
      providers: [
        AppStateService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OccurrenceCardComponent);
    occurrenceDate = new Date();
    component = fixture.componentInstance;
    component.occurrence = new Occurrence(occurrenceDate, []);
    component.occurrenceIndex = occurrenceIndex;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a header containing the date', () => {
    const title = fixture.debugElement.queryAll(By.css('.card-title'));
    const content = title[0].nativeElement.innerText;
    const formatted = new DatePipe('en-US').transform(occurrenceDate, 'fullDate');

    expect(content).toEqual(formatted);
  });

  it('should have a subheader containing the total flow', () => {
    component.occurrence = new Occurrence(new Date(), [
      new Transaction('Transaction', 100, false),
    ]);
    fixture.detectChanges();

    const formatted = new CurrencyPipe('en-US').transform(100);
    const subtitle = fixture.nativeElement.querySelector('mat-card-subtitle.mat-card-subtitle');

    expect(subtitle).toBeTruthy();
    expect(subtitle.innerText).toContain(formatted);
  });

  it('should not display a table if no transactions exist', () => {
    component.occurrence = new Occurrence(new Date(), []);
    fixture.detectChanges();

    const table = fixture.nativeElement.querySelector('table');
    expect(table).toBeNull();
  });

  it('should display a table if there is at least one transaction', () => {
    component.occurrence = new Occurrence(new Date(), [
      new Transaction(),
    ]);
    fixture.detectChanges();

    const table = fixture.nativeElement.querySelector('table');
    expect(table).toBeTruthy();
  });

  it('should display a table row for each transaction', () => {
    const transactions = [
      new Transaction(),
      new Transaction(),
      new Transaction(),
    ];
    component.occurrence = new Occurrence(new Date(), transactions);
    fixture.detectChanges();

    const bodyRows = fixture.debugElement.queryAll(By.css('table tbody tr'));
    expect(bodyRows.length).toEqual(transactions.length);
  });

  it('should highlight expenses in red', () => {
    const transactions = [
      new Transaction('Expense', 100, true),
    ];
    component.occurrence = new Occurrence(new Date(), transactions);
    fixture.detectChanges();

    const bodyRows = fixture.debugElement.queryAll(By.css('table tbody tr'));
    const title = bodyRows[0].query(By.css('.mat-column-title'));
    const amount = bodyRows[0].query(By.css('.mat-column-amount'));

    expect(title.classes['text-danger']).toBeTrue();
    expect(amount.classes['text-danger']).toBeTrue();
  });

  it('should highlight incomes in green', () => {
    const transactions = [
      new Transaction('Income', 100, false),
    ];
    component.occurrence = new Occurrence(new Date(), transactions);
    fixture.detectChanges();

    const bodyRows = fixture.debugElement.queryAll(By.css('table tbody tr'));
    const title = bodyRows[0].query(By.css('.mat-column-title'));
    const amount = bodyRows[0].query(By.css('.mat-column-amount'));

    expect(title.classes['text-success']).toBeTrue();
    expect(amount.classes['text-success']).toBeTrue();
  });

  it('should display the running total', () => {
    const amount = 100;
    const transactions = [
      new Transaction('Transaction', amount),
    ];
    const expectedText = new CurrencyPipe('en-US').transform(amount);
    const state = fixture.debugElement.injector.get(AppStateService);
    const runningTotalClass = new RunningTotal([], 0);
    spyOn(runningTotalClass, 'getTotal').and.returnValue(amount * -1);
    spyOnProperty(state, 'runningTotal').and.returnValue(runningTotalClass);

    component.occurrence = new Occurrence(new Date(), transactions);
    fixture.detectChanges();

    const bodyRows = fixture.debugElement.queryAll(By.css('table tbody tr'));
    const runningTotal = bodyRows[0].query(By.css('.mat-column-running-total'));
    expect(runningTotal.nativeElement.innerText).toEqual('-' + expectedText);
  });

  it('should highlight negative running totals in red', () => {
    component.occurrence = new Occurrence(new Date(), [<Transaction>{}]);
    const runningTotalClass = jasmine.createSpyObj('RunningTotal', ['getTotal']);
    runningTotalClass.getTotal.and.returnValue(-100);
    const state = fixture.debugElement.injector.get(AppStateService);
    spyOnProperty(state, 'runningTotal').and.returnValue(runningTotalClass);

    fixture.detectChanges();

    const bodyRows = fixture.debugElement.queryAll(By.css('table tbody tr'));
    const runningTotal = bodyRows[0].query(By.css('.mat-column-running-total span'));
    expect(runningTotal.classes['text-danger']).toBeTrue();
  });
});
