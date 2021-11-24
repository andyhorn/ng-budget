import { TestBed } from '@angular/core/testing';
import { Occurrence } from 'src/app/models/occurrence';
import { Frequency } from 'src/app/models/recurrence';
import { Transaction } from 'src/app/models/transaction';

import { AppStateService } from './app-state.service';

describe('AppStateService', () => {
  let service: AppStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to the first of the current month as the start date', () => {
    expect(service.startDate.getDate()).toEqual(1);
    expect(service.startDate.getMonth()).toEqual(new Date().getMonth());
    expect(service.startDate.getFullYear()).toEqual(new Date().getFullYear());
  });

  it('should default to the end of the current month as the end date', () => {
    const today = new Date();
    const lastDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0, 0, 0, 0, 0
    );
    expect(service.endDate.getDate()).toEqual(lastDay.getDate());
    expect(service.endDate.getMonth()).toEqual(today.getMonth());
    expect(service.endDate.getFullYear()).toEqual(today.getFullYear());
  });

  it('should start with an empty list of transactions', () => {
    expect(service.transactions.length).toEqual(0);
  });

  it('should start with an empty list of occurrences', () => {
    expect(service.occurrences.length).toEqual(0);
  });

  it('should set the time components of the start and end dates to zero', () => {
    const newStartDate = new Date();
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + 1);

    service.startDate = newStartDate;
    service.endDate = newEndDate;

    expect(service.startDate.getHours()).toEqual(0);
    expect(service.startDate.getMinutes()).toEqual(0);
    expect(service.startDate.getSeconds()).toEqual(0);
    expect(service.startDate.getMilliseconds()).toEqual(0);
    expect(service.endDate.getHours()).toEqual(0);
    expect(service.endDate.getMinutes()).toEqual(0);
    expect(service.endDate.getSeconds()).toEqual(0);
    expect(service.endDate.getMilliseconds()).toEqual(0);
  });

  it('should clear all transactions and occurrences when calling "clearTransactions"', () => {
    service.addTransaction(new Transaction());
    expect(service.transactions.length).toEqual(1);
    expect(service.occurrences.length).toEqual(1);

    service.clearTransactions();
    expect(service.transactions.length).toEqual(0);
    expect(service.occurrences.length).toEqual(0);
  });

  it('should give a new transaction a valid ID', () => {
    const transaction = new Transaction();
    transaction.id = 0;
    service.addTransaction(transaction);

    expect(service.transactions[0].id).toBeGreaterThan(0);
  });

  it('should create occurrences for each day with a transaction', () => {
    const today = new Date();
    const lastDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0, 0, 0, 0
      );
    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1, 0, 0, 0
    );
    const numDays = lastDay.getDate();
    const everyDay = new Transaction('Every day');

    everyDay.recurrence.frequency = Frequency.Daily;
    everyDay.recurrence.interval = 1;
    everyDay.recurrence.startDate = firstDay;

    service.addTransaction(everyDay);

    expect(service.occurrences.length).toEqual(numDays);
  });

  it('should not create multiple occurrences for the same date', () => {
    const today = new Date();
    const firstDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      1, 0, 0, 0, 0
    );
    const lastDay = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0, 0, 0, 0, 0
    );
    const numDays = lastDay.getDate();
    const everyDay = new Transaction('Every day');
    const alsoEveryDay = new Transaction('Also every day');

    everyDay.recurrence.frequency = Frequency.Daily;
    alsoEveryDay.recurrence.frequency = Frequency.Daily;
    everyDay.recurrence.interval = 1;
    alsoEveryDay.recurrence.interval = 1;
    everyDay.recurrence.startDate = firstDay;
    alsoEveryDay.recurrence.startDate = firstDay;

    service.addTransaction(everyDay);
    service.addTransaction(alsoEveryDay);

    expect(service.occurrences.length).toEqual(numDays);
    expect(service.occurrences.every((o: Occurrence) => o.transactions.length === 2));
  });

  it('should replace an existing transaction on an update', () => {
    const id = 3;
    const initialTitle = 'Initial state';
    const initialAmount = 100;
    const initialIsExpense = true;
    const initialInterval = 1;
    const initialFrequency = Frequency.Daily;
    const initialStartDate = new Date();
    initialStartDate.setHours(0, 0, 0, 0);
    const updatedTitle = 'New title';
    const updatedAmount = initialAmount * 2;
    const updatedIsExpense = !initialIsExpense;
    const updatedInterval = initialInterval + 3;
    const updatedFrequency = Frequency.Weekly;
    const updatedStartDate = new Date(initialStartDate)
    updatedStartDate.setHours(0, 0, 0, 0);
    updatedStartDate.setDate(initialStartDate.getDate() + 5);

    const transaction = new Transaction(initialTitle, initialAmount, initialIsExpense);
    transaction.id = id;
    transaction.recurrence.frequency = initialFrequency;
    transaction.recurrence.interval = initialInterval;
    transaction.recurrence.startDate = initialStartDate;

    service.addTransaction(transaction);

    expect(service.transactions[0].id).toEqual(id);
    expect(service.transactions[0].amount).toEqual(initialAmount);
    expect(service.transactions[0].isExpense).toEqual(initialIsExpense);
    expect(service.transactions[0].title).toEqual(initialTitle);
    expect(service.transactions[0].recurrence.frequency).toEqual(initialFrequency);
    expect(service.transactions[0].recurrence.interval).toEqual(initialInterval);
    expect(service.transactions[0].recurrence.startDate).toEqual(initialStartDate);

    transaction.title = updatedTitle;
    transaction.amount = updatedAmount;
    transaction.isExpense = updatedIsExpense;
    transaction.recurrence.frequency = updatedFrequency;
    transaction.recurrence.interval = updatedInterval;
    transaction.recurrence.startDate = updatedStartDate;

    service.updateTransaction(transaction);

    expect(service.transactions[0].id).toEqual(id);
    expect(service.transactions[0].amount).toEqual(updatedAmount);
    expect(service.transactions[0].title).toEqual(updatedTitle);
    expect(service.transactions[0].isExpense).toEqual(updatedIsExpense);
    expect(service.transactions[0].recurrence.frequency).toEqual(updatedFrequency);
    expect(service.transactions[0].recurrence.interval).toEqual(updatedInterval);
    expect(service.transactions[0].recurrence.startDate).toEqual(updatedStartDate);
  });

  it('should remove transactions from occurrences if they are changed to a different rule', () => {
    const everyDay = new Transaction('Every day');
    everyDay.id = 1;
    everyDay.recurrence.frequency = Frequency.Daily;
    everyDay.recurrence.interval = 1;
    everyDay.recurrence.startDate = new Date();

    const everyOtherDay = new Transaction('Every other day');
    everyOtherDay.id = 2;
    everyOtherDay.recurrence.frequency = Frequency.Daily;
    everyOtherDay.recurrence.interval = 2;
    everyOtherDay.recurrence.startDate = new Date();

    service.addTransactions([everyDay, everyOtherDay]);
    const numOccurrences = service.occurrences.length;

    expect(numOccurrences).toBeGreaterThan(0);

    everyOtherDay.recurrence.interval = 4;
    service.updateTransaction(everyOtherDay);

    expect(service.occurrences.length).toEqual(numOccurrences);
    expect(service.occurrences.some((o: Occurrence) => o.transactions.length === 2)).toBeTrue();
    expect(service.occurrences.every((o: Occurrence) => o.transactions.length === 2)).toBeFalse();
  });

  it('should add a new transaction to an existing occurrence if it occurs alongside another transaction', () => {
    const everyDay = new Transaction('Every day');
    everyDay.id = 1;
    everyDay.recurrence.frequency = Frequency.Daily;
    everyDay.recurrence.interval = 1;
    everyDay.recurrence.startDate = new Date();

    service.addTransaction(everyDay);
    const numOccurrences = service.occurrences.length;

    const everyOtherDay = new Transaction('Every other day');
    everyOtherDay.id = 2;
    everyOtherDay.recurrence.frequency = Frequency.Daily;
    everyOtherDay.recurrence.interval = 2;
    everyOtherDay.recurrence.startDate = new Date();

    service.addTransaction(everyOtherDay);

    expect(service.occurrences.length).toEqual(numOccurrences);
    expect(service.occurrences.some((o: Occurrence) => o.transactions.length === 2)).toBeTrue();
  });

  it('should remove occurrences that no longer have any transactions', () => {
    const today = new Date();
    const firstDay = new Date(today);
    firstDay.setDate(0);
    firstDay.setHours(0, 0, 0, 0);
    const everyDay = new Transaction('Every day');
    everyDay.recurrence.frequency = Frequency.Daily;
    everyDay.recurrence.interval = 1;
    everyDay.recurrence.startDate = firstDay;

    service.addTransaction(everyDay);
    const numOccurrences = service.occurrences.length;

    everyDay.recurrence.interval = 3;
    service.updateTransaction(everyDay);

    expect(service.occurrences.length).not.toEqual(numOccurrences);

    service.removeTransaction(everyDay.id);

    expect(service.occurrences.length).toEqual(0);
  });
});
