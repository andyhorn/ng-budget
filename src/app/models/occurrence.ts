import { Transaction } from "./transaction";

export class Occurrence {
  public date: Date;
  public transactions: Transaction[];

  constructor(date: Date, transactions: Transaction[]) {
    this.date = date;
    this.transactions = transactions;
    this.transactions.sort((a: Transaction, b: Transaction) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
  }

  public get total(): number {
    return this.transactions.reduce((sum: number, t: Transaction) => {
      return t.isExpense ? sum - t.amount : sum + t.amount;
    }, 0);
  }
}
