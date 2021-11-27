import { Occurrence } from './occurrence';
import { RunningTotal } from './running-total';
import { Transaction, TransactionTypes } from './transaction';

describe('RunningTotal', () => {
  it('should create an instance', () => {
    expect(new RunningTotal([])).toBeTruthy();
  });

  it('should return 0 for an out of range occurrence index', () => {
    const total = new RunningTotal([]);
    const result = total.getTotal(1, 0);

    expect(result).toEqual(0);
  });

  it('should return 0 for an out of range transaction index', () => {
    const total = new RunningTotal([
      new Occurrence(new Date(), []),
    ]);
    const result = total.getTotal(0, 1);

    expect(result).toEqual(0);
  });

  it('should throw an error for negative occurrence indices', () => {
    const total = new RunningTotal([]);

    expect(() => total.getTotal(-1, 0)).toThrow();
  });

  it('should throw an error for negative transaction indices', () => {
    const total = new RunningTotal([
      new Occurrence(new Date(), []),
    ]);

    expect(() => total.getTotal(0, -1)).toThrow();
  });

  it('should return starting amount if no occurrences are present', () => {
    const amount = 100;
    const total = new RunningTotal([], amount);

    expect(total.getTotal(0, 0)).toEqual(amount);
  });

  it('should subtract an expense from the starting amount', () => {
    const amount = 100;
    const transactionAmount = 50;
    const transaction = new Transaction('Test', transactionAmount, TransactionTypes.Expense);
    const occurrence = new Occurrence(new Date(), [transaction]);
    const total = new RunningTotal([occurrence], amount);

    const result = total.getTotal(0, 0);
    expect(result).toEqual(amount - transactionAmount);
  });

  it('should add an income to the starting amount', () => {
    const amount = 100;
    const transactionAmount = 50;
    const transaction = new Transaction('Test', transactionAmount, TransactionTypes.Income);
    const occurrence = new Occurrence(new Date(), [transaction]);
    const total = new RunningTotal([occurrence], amount);

    const result = total.getTotal(0, 0);
    expect(result).toEqual(amount + transactionAmount);
  });

  it('should calculate the running totals', () => {
    const startingAmount = 100;
    const transactions = [
      {
        'transaction': new Transaction('A', 100, TransactionTypes.Income),
        'runningTotal': 200,
      },
      {
        'transaction': new Transaction('B', 50, TransactionTypes.Expense),
        'runningTotal': 150,
      },
      {
        'transaction': new Transaction('C', 25, TransactionTypes.Income),
        'runningTotal': 175,
      },
      {
        'transaction': new Transaction('D', 175, TransactionTypes.Expense),
        'runningTotal': 0,
      },
    ];
    const occurrences = [new Occurrence(new Date(), transactions.map(t => t.transaction))];
    const total = new RunningTotal(occurrences, startingAmount);

    for (let i = 0; i < transactions.length; i++) {
      const result = total.getTotal(0, i);
      expect(result).toEqual(transactions[i].runningTotal);
    }
  });
});
