import { Component, Input } from '@angular/core';
import { Occurrence } from '../models/occurrence';
import { Transaction } from '../models/transaction';
import { AppStateService } from '../services/state/app-state.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.sass']
})
export class CalendarComponent {
  public get firstDay(): Date {
    return this.state.startDate;
  }

  public get lastDay(): Date {
    return this.state.endDate;
  }

  public get startingAmount(): number {
    return this.state.startingAmount;
  }

  public get finalAmount(): number {
    return this.startingAmount - this.totalExpenses + this.totalIncome;
  }

  public get totalExpenses(): number {
    const transactions: Transaction[] = this._extractTransactions(true);

    return this._getTransactionSum(transactions);
  }

  public get totalIncome(): number {
    const transactions: Transaction[] = this._extractTransactions(false);

    return this._getTransactionSum(transactions);
  }

  public get netFlow(): number {
    return this.state.occurrences.reduce((sum: number, current: Occurrence) => sum + current.total, 0);
  }

  public get occurrences(): readonly Occurrence[] {
    return this.state.occurrences;
  }

  constructor(public state: AppStateService) { }

  private _extractTransactions(isExpense: boolean): Transaction[] {
    return this.state.occurrences
      .map((o: Occurrence) => o.transactions)
      .reduce((list: Transaction[], current: Transaction[]) => list.concat(current))
      .filter((t: Transaction) => t.isExpense === isExpense);
  }

  private _getTransactionSum(transactions: Transaction[]): number {
    return transactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  }
}
