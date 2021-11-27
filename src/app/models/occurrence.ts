import { Transaction, TransactionTypes } from "./transaction";

export class Occurrence {
  private _date: Date;
  private _transactions: Transaction[];
  private _total: number;

  public get date(): Date {
    return this._date;
  }

  public get transactions(): readonly Transaction[] {
    return this._transactions;
  }

  public get total(): number {
    return this._total;
  }

  constructor(date: Date, transactions: Transaction[]) {
    this._date = date;
    this._transactions = transactions;
    this.sortTransactions();
    this._total = this.calculateTotal();
  }

  private sortTransactions(): void {
    this._transactions.sort((a: Transaction, b: Transaction) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
  }

  private calculateTotal(): number {
    return this._transactions.reduce((sum: number, current: Transaction) => {
      return current.type == TransactionTypes.Expense
        ? sum - current.amount
        : sum + current.amount;
    }, 0);
  }
}
