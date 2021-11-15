import { Transaction } from "./transaction";

export class Occurence {
  date: Date;
  transactions: Transaction[];

  constructor(date: Date, transactions: Transaction[]) {
    this.date = date;
    this.transactions = transactions;
  }

  public get total(): number {
    return this.transactions.reduce((sum: number, t: Transaction) => {
      return t.isExpense ? sum - t.amount : sum + t.amount;
    }, 0);
  }
}
