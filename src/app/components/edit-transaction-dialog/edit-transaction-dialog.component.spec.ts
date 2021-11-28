import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { EditTransactionDialogData, EditTransactionDialogTypes } from 'src/app/models/edit-transaction-dialog-data';
import { Frequency } from 'src/app/models/recurrence';
import { Transaction, TransactionTypes } from 'src/app/models/transaction';
import { AppStateService } from 'src/app/services/state/app-state.service';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';

import { EditTransactionDialogComponent } from './edit-transaction-dialog.component';

describe('EditTransactionDialogComponent (NEW)', () => {
  let component: EditTransactionDialogComponent;
  let fixture: ComponentFixture<EditTransactionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditTransactionDialogComponent,
        TransactionFormComponent
      ],
      imports: [
        MatDialogModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: function() {} }},
        { provide: MAT_DIALOG_DATA, useValue: {
          id: 0,
          dialogType: EditTransactionDialogTypes.New,
          type: TransactionTypes.Expense,
        }},
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title to an empty string with a new transaction', () => {
    expect(component.title).toEqual('');
  });

  it('should have an amount of zero', () => {
    expect(component.amount).toEqual(0);
  });

  it('should use a default frequency of monthly', () => {
    expect(component.frequency).toEqual(Frequency.Monthly);
  });

  it('should use a default start date of today', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expect(component.startDate).toEqual(today);
  });

  it('should call addTransaction when saving', () => {
    const state = fixture.debugElement.injector.get(AppStateService);
    const spy = spyOn(state, 'addTransaction');

    component.onSaveClick();

    expect(spy.calls.count()).toEqual(1);
  });

  it('should build a transaction using its data', () => {
    const state = fixture.debugElement.injector.get(AppStateService);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    component.amount = 1.23;
    component.frequency = Frequency.Daily;
    component.interval = 12;
    component.type = TransactionTypes.Expense;
    component.startDate = today;
    component.title = 'Test';

    spyOn(state, 'addTransaction').and.callFake((t) => {
      expect(t.amount).toEqual(1.23);
      expect(t.id).toEqual(0);
      expect(t.type).toEqual(TransactionTypes.Expense);
      expect(t.title).toEqual('Test');
      expect(t.recurrence.frequency).toEqual(Frequency.Daily);
      expect(t.recurrence.interval).toEqual(12);
      expect(t.recurrence.startDate).toEqual(today);
    });

    component.onSaveClick();
  });

  it('should disable the save button if the title is empty', () => {
    component.title = '';
    fixture.detectChanges();

    const buttons = fixture.debugElement
      .queryAll(By.css('button'));
    const saveButton = buttons.find(b => b.nativeElement.innerText.includes('Save'));

    expect(saveButton).toBeTruthy();
    expect(saveButton?.nativeElement.disabled).toBeTrue();

    component.title = 'Some text';
    fixture.detectChanges();

    expect(saveButton?.nativeElement.disabled).toBeFalsy();
  });
});

describe('Edit Incomes', () => {
  let component: EditTransactionDialogComponent;
  let fixture: ComponentFixture<EditTransactionDialogComponent>;
  const transaction = new Transaction('Test', 1.23, TransactionTypes.Expense);
  transaction.id = 1;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditTransactionDialogComponent,
        TransactionFormComponent,
      ],
      imports: [
        MatDialogModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: function() {} }},
        { provide: MAT_DIALOG_DATA, useValue: {
          id: 0,
          dialogType: EditTransactionDialogTypes.New,
          type: TransactionTypes.Income,
        }},
      ],
    })
    .compileComponents();

    let state = TestBed.inject(AppStateService);
    spyOnProperty(state, 'transactions').and.returnValue([transaction]);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should hide the yearly frequency for incomes', () => {
    const frequencySelect = fixture.debugElement.query(By.css('mat-select'));
    const availableOptions = frequencySelect.children
      .filter(c => c.name == 'mat-option')
      .map(e => e.nativeElement.innerText.trim());
    const expectedOptions = Object.keys(Frequency)
      .filter(k => isNaN(Number(k)))
      .filter(k => k !== 'Yearly');

    expect(availableOptions).toEqual(expectedOptions);
  });
})

describe('EditTransactionDialogComponent (EDIT)', () => {
  let component: EditTransactionDialogComponent;
  let fixture: ComponentFixture<EditTransactionDialogComponent>;
  const transaction = new Transaction('Test', 1.23, TransactionTypes.Expense);
  transaction.id = 1;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EditTransactionDialogComponent,
      ],
      imports: [
        MatDialogModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: function() {} }},
        { provide: MAT_DIALOG_DATA, useValue: {
          id: 1,
          dialogType: EditTransactionDialogTypes.Edit,
          type: TransactionTypes.Expense,
        }},
      ],
    })
    .compileComponents();

    let state = TestBed.inject(AppStateService);
    spyOnProperty(state, 'transactions').and.returnValue([transaction]);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should retrieve the transaction under edit', () => {
    expect(component.amount).toEqual(transaction.amount);
    expect(component.frequency).toEqual(transaction.recurrence.frequency);
    expect(component.interval).toEqual(transaction.recurrence.interval);
    expect(component.type).toEqual(transaction.type);
    expect(component.startDate).toEqual(transaction.recurrence.startDate);
    expect(component.title).toEqual(transaction.title);
  });
});
