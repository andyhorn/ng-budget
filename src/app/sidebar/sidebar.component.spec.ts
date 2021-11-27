import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { TransactionComponent } from '../components/transaction/transaction.component';
import { EditTransactionDialogData, EditTransactionDialogTypes } from '../models/edit-transaction-dialog-data';
import { Transaction, TransactionTypes } from '../models/transaction';
import { AppStateService } from '../services/state/app-state.service';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarComponent, TransactionComponent ],
      imports: [
        MatDialogModule,
        MatCardModule
      ],
      providers: [
        {
          provide: MatDialog,
          useValue: {open: function(component: Component, config: any) {}},
        },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter incomes by type', () => {
    const transactions = [
      new Transaction('Expense One', 100, TransactionTypes.Expense),
      new Transaction('Expense Two', 200, TransactionTypes.Expense),
      new Transaction('Income One', 300, TransactionTypes.Income),
      new Transaction('Income Two', 400, TransactionTypes.Income),
    ];
    const incomes = transactions
      .filter(t => t.type == TransactionTypes.Income);
    const expenses = transactions
      .filter(t => t.type == TransactionTypes.Expense);
    const state = fixture.debugElement.injector.get(AppStateService);
    spyOnProperty(state, 'transactions').and.returnValue(transactions);

    fixture.detectChanges();

    expect(component.incomeTransactions.length).toEqual(incomes.length);
    expect(component.expenseTransactions.length).toEqual(expenses.length);
    expect(component.incomeTransactions.every(t => t.type == TransactionTypes.Income)).toBeTrue();
    expect(component.expenseTransactions.every(t => t.type == TransactionTypes.Expense)).toBeTrue();
  });

  it('should return the total income amount', () => {
    const transactions = [
      new Transaction('Income One', 100, TransactionTypes.Income),
      new Transaction('Income Two', 200, TransactionTypes.Income),
      new Transaction('Income Three', 300, TransactionTypes.Expense),
      new Transaction('Expense One', 400, TransactionTypes.Expense),
    ];
    const incomeAmount = transactions
      .filter(t => t.type == TransactionTypes.Income)
      .reduce((sum, curr) => sum + curr.amount, 0);
    const state = fixture.debugElement.injector.get(AppStateService);
    spyOnProperty(state, 'transactions').and.returnValue(transactions);
    fixture.detectChanges();

    const calculatedIncome = component.totalIncomeAmount;

    expect(calculatedIncome).toEqual(incomeAmount);
  });

  it('should return the total expense amount', () => {
    const transactions = [
      new Transaction('Expense One', 100, TransactionTypes.Expense),
      new Transaction('Expense Two', 200, TransactionTypes.Expense),
      new Transaction('Expense Three', 300, TransactionTypes.Expense),
      new Transaction('Income One', 400, TransactionTypes.Income),
    ];
    const expenseAmount = transactions
      .filter(t => t.type == TransactionTypes.Expense)
      .reduce((sum, curr) => sum + curr.amount, 0);
    const state = fixture.debugElement.injector.get(AppStateService);
    spyOnProperty(state, 'transactions').and.returnValue(transactions);
    fixture.detectChanges();

    const calculatedExpenses = component.totalExpenseAmount;

    expect(calculatedExpenses).toEqual(expenseAmount);
  });

  it('should display a "new" button for the income section', () => {
    const button = getButton('Income');

    expect(button).toBeTruthy();
  });

  it('should display a "new" button for the expenses section', () => {
    const button = getButton('Expenses');

    expect(button).toBeTruthy();
  });

  it('should display a component for each transaction', () => {
    const transactions = [
      new Transaction('Test One', 100, TransactionTypes.Income),
      new Transaction('Test Two', 200, TransactionTypes.Income),
      new Transaction('Test Three', 300, TransactionTypes.Expense),
    ];
    const state = fixture.debugElement.injector.get(AppStateService);
    spyOnProperty(state, 'transactions').and.returnValue(transactions);

    fixture.detectChanges();
    const components = fixture.debugElement.queryAll(By.directive(TransactionComponent));

    expect(components.length).toEqual(transactions.length);
  });

  it('should open the transaction dialog for each button click', () => {
    const buttons = [
      getButton('Income'),
      getButton('Expenses'),
    ];
    const dialog = fixture.debugElement.injector.get(MatDialog);
    const spy = spyOn(dialog, 'open');
    fixture.detectChanges();

    for (let button of buttons) {
      button?.triggerEventHandler('click', {});
    }

    expect(spy.calls.count()).toEqual(buttons.length);
  });

  it('should open a new income dialog', async () => {
    let dialogData: any = {};
    const dialog = fixture.debugElement.injector.get(MatDialog);
    spyOn(dialog, 'open').and.callFake((_, config: any) => {
      const transactionData: EditTransactionDialogData = config.data;
      expect(transactionData).toBeTruthy();
      expect(transactionData.id).toEqual(0);
      expect(transactionData.dialogType).toEqual(EditTransactionDialogTypes.New);
      expect(transactionData.type).toEqual(TransactionTypes.Income);

      return <MatDialogRef<Component>>{};
    });
    fixture.detectChanges();

    component.onNewIncomeClick();
  });

  it('should open a new expense dialog', async () => {
    const dialog = fixture.debugElement.injector.get(MatDialog);
    spyOn(dialog, 'open').and.callFake((_, config: any) => {
      const transactionData: EditTransactionDialogData = config.data;
      expect(transactionData).toBeTruthy();
      expect(transactionData.id).toEqual(0);
      expect(transactionData.dialogType).toEqual(EditTransactionDialogTypes.New);
      expect(transactionData.type).toEqual(TransactionTypes.Expense);

      return <MatDialogRef<Component>>{};
    });
    fixture.detectChanges();

    component.onNewExpenseClick();
  });

  it('should sort transactions into their section', () => {
    const transactions = [
      new Transaction('Test One', 100, TransactionTypes.Income),
      new Transaction('Test Two', 200, TransactionTypes.Income),
      new Transaction('Test Three', 300, TransactionTypes.Expense),
    ];
    const numIncomeComponents = transactions.filter(t => t.type == TransactionTypes.Income).length;
    const numExpenseComponents = transactions.filter(t => t.type == TransactionTypes.Expense).length;
    const state = fixture.debugElement.injector.get(AppStateService);
    spyOnProperty(state, 'transactions').and.returnValue(transactions);
    fixture.detectChanges();

    const incomeComponents = getTransactionComponents('Income');
    const expenseComponents = getTransactionComponents('Expenses');

    expect(incomeComponents?.length).toEqual(numIncomeComponents);
    expect(expenseComponents?.length).toEqual(numExpenseComponents);
  });

  function getTransactionComponents(section: string): DebugElement[] {
    const header = fixture.debugElement.queryAll(By.css('h2'))
      .filter(h => h.nativeElement.innerText.includes(section))[0];
    const components = header.parent?.parent?.parent?.children
      .filter(c => c.name == 'app-transaction');

    return components ?? [];
  }

  function getButton(section: string): DebugElement | undefined {
    const headers = fixture.debugElement.queryAll(By.css('h2'));
    const header = headers.filter(h => h.nativeElement.innerText == section)[0];
    const button = header.parent?.parent?.children.find(c => c.name == 'button');

    return button;
  }
});
