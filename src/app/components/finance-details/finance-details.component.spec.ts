import { CurrencyPipe } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Occurrence } from 'src/app/models/occurrence';
import { Transaction } from 'src/app/models/transaction';
import { AppStateService } from 'src/app/services/state/app-state.service';

import { FinanceDetailsComponent } from './finance-details.component';

class MockAppStateService {
  public occurrences = [];
  public startingAmount = 0;
}

describe('FinanceDetailsComponent', () => {
  let component: FinanceDetailsComponent;
  let fixture: ComponentFixture<FinanceDetailsComponent>;
  let state: any;

  beforeEach(async () => {
    state = new MockAppStateService();
    await TestBed.configureTestingModule({
      declarations: [
        FinanceDetailsComponent
      ],
      imports: [
        FormsModule,
      ],
      providers: [
        { provide: AppStateService, useValue: state },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pull the starting amount from the state', () => {
    expect(component.startingAmount).toEqual(0);

    state.startingAmount = 1.23;
    fixture.detectChanges();

    expect(component.startingAmount).toEqual(1.23);
  });

  it('should calculate the total income', () => {
    const incomes = makeTransactions(3, false);
    const occurrences = [
      new Occurrence(new Date('January 1, 2020'), incomes),
    ];
    const expectedAmount = getTransactionSum(occurrences[0].transactions as Transaction[]);

    state.occurrences = occurrences;
    fixture.detectChanges();

    expect(component.totalIncome).toEqual(expectedAmount);
  });

  it('should calculate the total expenses', () => {
    const expenses = makeTransactions(3, true);
    const occurrences = [
      new Occurrence(new Date('January 1, 2020'), expenses),
    ];
    const expected = getTransactionSum(expenses);

    state.occurrences = occurrences;
    fixture.detectChanges();

    expect(component.totalExpenses).toEqual(expected);
  });

  it('should calculate the final amount', () => {
    const expenses = makeTransactions(3, true);
    const incomes = makeTransactions(3, false);
    const occurrences = [
      new Occurrence(new Date('January 1, 2020'), [
        ...incomes,
        ...expenses,
      ]),
    ];
    const startingAmount = 100;
    const expected = startingAmount
      + getTransactionSum(incomes) - getTransactionSum(expenses);

    state.occurrences = occurrences;
    state.startingAmount = startingAmount;
    fixture.detectChanges();

    expect(component.finalAmount).toEqual(expected);
  });

  it('should calculate the net flow', () => {
    const expenses = makeTransactions(3, true);
    const incomes = makeTransactions(3, false);
    const expected = getTransactionSum(incomes) - getTransactionSum(expenses);

    state.occurrences = [
      new Occurrence(new Date('January 1, 2020'), [...incomes, ...expenses]),
    ];
    fixture.detectChanges();

    expect(component.netFlow).toEqual(expected);
  });

  it('should display the total income', () => {
    const incomes = [
      new Transaction('Income', 100, false),
    ];
    const occurrences = [
      new Occurrence(new Date('January 1, 2020'), incomes),
    ];

    state.occurrences = occurrences;
    fixture.detectChanges();

    const spanContent = getSpanContent(getColumnContaining('income'));
    const expected = toCurrency(getTransactionSum(incomes));

    expect(spanContent).toEqual(expected);
  });

  it('should display the total expenses', () => {
    const expenses = makeTransactions(2, true);
    const occurrences = [
      new Occurrence(new Date('January 1, 2020'), expenses),
    ];
    const expectedAmount = getTransactionSum(expenses);
    const expectedText = toCurrency(expectedAmount);

    state.occurrences = occurrences;
    fixture.detectChanges();

    const spanContent = getSpanContent(getColumnContaining('expenses'));

    expect(spanContent).toEqual(expectedText);
  });

  it('should display the net flow', () => {
    const incomes = makeTransactions(3, false);
    const expenses = makeTransactions(2, true);
    const occurrences = [
      new Occurrence(new Date('January 1, 2020'), [
        ...incomes,
        ...expenses,
      ]),
    ];

    const expectedNetFlow = getTransactionSum(incomes) - getTransactionSum(expenses);
    const expectedText = toCurrency(expectedNetFlow);

    state.occurrences = occurrences;
    fixture.detectChanges();

    const spanText = getSpanContent(getColumnContaining('net flow'));

    expect(spanText).toEqual(expectedText);
  });

  it('should highlight the net flow red if it is negative', () => {
    const expenses = makeTransactions(2, true);
    const occurrences = [
      new Occurrence(new Date('January 1, 2020'), expenses),
    ];

    state.occurrences = occurrences;
    fixture.detectChanges();

    const spanElement = getSpanElement(getColumnContaining('net flow'));
    expect(spanElement.classes['text-danger']).toBeTrue();
  });

  it('should highlight the net flow green if it is positive', () => {
    const incomes = makeTransactions(2, false);
    const occurrences = [
      new Occurrence(new Date('January 1, 2020'), incomes),
    ];

    state.occurrences = occurrences;
    fixture.detectChanges();

    const spanElement = getSpanElement(getColumnContaining('net flow'));
    expect(spanElement.classes['text-success']).toBeTrue();
  });

  it('should display the starting amount', () => {
    const amount = 1000;
    state.startingAmount = amount;
    fixture.detectChanges();

    const spanContent = getSpanContent(getColumnContaining('starting amount'));

    expect(spanContent).toEqual(toCurrency(amount));
  });

  it('should display the final amount', () => {
    const incomes = makeTransactions(3, false);
    const expenses = makeTransactions(2, true);
    const starting = 1000;
    const incomeTotal = getTransactionSum(incomes);
    const expenseTotal = getTransactionSum(expenses);
    const finalAmount = starting + incomeTotal - expenseTotal;
    const expectedText = toCurrency(finalAmount);
    const occurrences = [
      new Occurrence(new Date('January 1, 2020'), [
        ...incomes, ...expenses,
      ]),
    ];

    state.startingAmount = starting;
    state.occurrences = occurrences;
    fixture.detectChanges();

    const spanContent = getSpanContent(getColumnContaining('final amount'));
    expect(spanContent).toEqual(expectedText);
  });

  /* HELPER FUNCTIONS */
  function getSpanElement(div: DebugElement): DebugElement {
    return div.query(By.css('span'));
  }

  function getSpanContent(div: DebugElement): string {
    return getSpanElement(div).nativeElement.innerText;
  }

  function getColumnContaining(text: string): DebugElement {
    return fixture.debugElement.queryAll(By.css('.col'))
      .filter(e => e.nativeElement.innerText.toLowerCase().includes(text))[0];
  }
});


function makeTransactions(num: number = 3, areExpenses: boolean = true): Transaction[] {
  const transactions = [];

  for (let i = 0; i < num; i++) {
    const amount = Math.floor(Math.random() * 100);
    transactions.push(new Transaction(`Transaction ${i + 1}`, amount, areExpenses));
  }

  return transactions;
}

function getTransactionSum(transactions: Transaction[]): number {
  return transactions.reduce((sum, curr) => sum + curr.amount, 0);
}

function toCurrency(amount: string | number): string {
  return new CurrencyPipe('en-US').transform(amount)!;
}
