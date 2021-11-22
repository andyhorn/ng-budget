import { Occurrence } from './occurrence';
import { Transaction } from './transaction';

describe('Occurrence', () => {
  it('should create an instance', () => {
    expect(new Occurrence(new Date(), [])).toBeTruthy();
  });

  it('should sort the transactions by title', () => {
    const transactions = [
      new Transaction('A'),
      new Transaction('C'),
      new Transaction('B'),
    ];

    const occurrence = new Occurrence(new Date(), transactions);

    expect(occurrence.transactions[0].title).toEqual('A');
    expect(occurrence.transactions[1].title).toEqual('B');
    expect(occurrence.transactions[2].title).toEqual('C');
  });

  it('should calculate the sum of all transactions', () => {
    const incomes = [
      new Transaction('A', 1000, false),
      new Transaction('B', 100, false),
    ];
    const expenses = [
      new Transaction('C', 50),
      new Transaction('D', 100),
    ];
    const transactions = [...incomes, ...expenses];
    const expectedTotal = incomes.reduce((sum, curr) => sum + curr.amount, 0) -
      expenses.reduce((sum, curr) => sum + curr.amount, 0);
    const occurrence = new Occurrence(new Date(), transactions);

    expect(occurrence.total).toEqual(expectedTotal);
  });
});
