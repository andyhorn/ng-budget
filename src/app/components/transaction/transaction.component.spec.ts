import { CurrencyPipe, DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { By } from '@angular/platform-browser';
import { Frequency } from 'src/app/models/recurrence';
import { Transaction } from 'src/app/models/transaction';
import { AppStateService } from 'src/app/services/state/app-state.service';
import { FrequencyDisplayComponent } from '../frequency-display/frequency-display.component';

import { TransactionComponent } from './transaction.component';

describe('TransactionComponent', () => {
  const id = 1;
  const amount = 1000;
  const transactionTitle = 'Test Transaction';
  const frequency = Frequency.Daily;
  const interval = 3;
  const startDate = new Date();
  const isExpense = true;
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;
  let transaction: Transaction;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionComponent, FrequencyDisplayComponent ],
      imports: [
        MatDialogModule,
        MatFormFieldModule,
        FormsModule,
        MatCardModule,
      ],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: function(component: any, data: any) {}
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    transaction = new Transaction(transactionTitle, amount, isExpense);
    transaction.recurrence.frequency = frequency;
    transaction.recurrence.interval = interval;
    transaction.recurrence.startDate = startDate;
    transaction.id = id;
    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
    component.transaction = transaction;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the transaction title', () => {
    const title = fixture.debugElement.query(By.css('.mat-card-title span'));
    expect(title).toBeTruthy();
    const text = title.nativeElement.innerText;
    expect(text).toEqual(transactionTitle);
  });

  it('should display the transaction amount, formatted as currency', () => {
    const currency = new CurrencyPipe('en-US').transform(amount);
    const subtitle = fixture.debugElement.query(By.css('.mat-card-subtitle span'));
    expect(subtitle).toBeTruthy();
    const text = subtitle.nativeElement.innerText;
    expect(text).toEqual(currency);
  });

  it('should display the app frequency text', () => {
    const element = fixture.debugElement.query(By.css('.mat-card-subtitle app-frequency-display'));
    expect(element).toBeTruthy();
  });

  it('should display the interval start date', () => {
    const expected = new DatePipe('en-US').transform(startDate);
    const subtitleSpans = fixture.debugElement.queryAll(By.css('.mat-card-subtitle p span'));
    const element = subtitleSpans[subtitleSpans.length - 1];
    expect(element).toBeTruthy();
    expect(element.nativeElement.innerText).toContain(expected);
  });

  it('should trigger the delete method when the delete button is clicked', () => {
    const spy = spyOn(component, 'onDeleteClick').and.stub();
    const buttons = fixture.debugElement.queryAll(By.css('.mat-card-title button'));
    const button = buttons.find(e => e.nativeElement.innerText.includes('delete'));
    expect(button).toBeTruthy();

    button!.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(spy.calls.count()).toEqual(1);
  });

  it('should remove the transaction from the state when the dialog is confirmed', () => {
    let transactionId: number;
    const state = fixture.debugElement.injector.get(AppStateService);
    const spy = spyOn(state, 'removeTransaction').and.callFake(id => transactionId = id);
    spyOn(window, 'alert').and.callFake(_ => true);

    component.onDeleteClick();
    fixture.detectChanges();

    expect(spy.calls.count()).toEqual(1);
    expect(transactionId!).toEqual(id);
  });

  it('should not remove the transaction from the state when the dialog is rejected', () => {
    const state = fixture.debugElement.injector.get(AppStateService);
    const spy = spyOn(state, 'removeTransaction');
    spyOn(window, 'alert').and.callFake(_ => false);

    component.onDeleteClick();
    fixture.detectChanges();

    expect(spy.calls.count()).toEqual(0);
  });

  it('should open a dialog with the transaction data when the edit button is clicked', () => {
    let transactionData: any, dialogComponent: any;
    const dialog = fixture.debugElement.injector.get(MatDialog);
    const spy = spyOn(dialog, 'open').and.callFake((component, data) => {
      dialogComponent = component;
      transactionData = data;
      return <MatDialogRef<any, any>>{};
    });

    const buttons = fixture.debugElement.queryAll(By.css('.mat-card-title button'));
    const button = buttons.find(e => e.nativeElement.innerText.includes('edit'));

    button?.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(spy.calls.count()).toEqual(1);
    expect(transactionData).toBeTruthy();
    expect(transactionData.data.id).toEqual(id);
  });
});
