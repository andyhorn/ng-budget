import { Frequency } from "../models/recurrence";
import { Transaction } from "../models/transaction";

export abstract class TransactionDialogBase {
  public title: string = '';
  public amount: number = 0;
  public frequency: Frequency = Frequency.Once;
  public interval: number = 0;
  public startDate: Date = new Date();

  get canSave(): boolean {
    return this.title.trim()?.length > 0;
  }

  public onChange(transaction: Transaction): void {
    this.title = transaction.title;
    this.amount = transaction.amount;
    this.frequency = transaction.recurrence.frequency;
    this.interval = transaction.recurrence.interval;
    this.startDate = transaction.recurrence.startDate;
  }
}

