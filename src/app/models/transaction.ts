import { Recurrence } from "./recurrence";

export class Transaction {
  id: number;
  title: string;
  isExpense: boolean;
  amount: number;
  recurrence: Recurrence;

  constructor() {
    this.id = 0;
    this.title = '';
    this.isExpense = true;
    this.amount = 0;
    this.recurrence = new Recurrence();
  }
}
