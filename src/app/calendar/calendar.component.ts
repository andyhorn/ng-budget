import { Component, Input, OnInit } from '@angular/core';
import { Occurrence } from '../models/occurernce';
import { RunningTotal } from '../models/running-total';
import { Transaction } from '../models/transaction';
import { TransactionService } from '../services/transaction.service';
import { OccurrenceFinder } from '../utilities/occurrence-finder';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.sass']
})
export class CalendarComponent implements OnInit {
  @Input() firstDay!: Date;
  @Input() lastDay!: Date;
  @Input() startingAmount!: number;
  public occurrences: Occurrence[] = [];
  private _transactions: Transaction[] = [];
  private _runningTotal!: RunningTotal;


  constructor(private _transactionService: TransactionService) { }

  get finalAmount(): number {
    return this.startingAmount - this.totalExpenses + this.totalIncome;
  }

  get totalExpenses(): number {
    const transactions: Transaction[] = this._extractTransactions(this.occurrences)
      .filter((t: Transaction) => t.isExpense);

    return this._getTransactionSum(transactions);
  }

  get totalIncome(): number {
    const transactions: Transaction[] = this._extractTransactions(this.occurrences)
      .filter((t: Transaction) => !t.isExpense);

    return this._getTransactionSum(transactions);
  }

  get netFlow(): number {
    return this.occurrences.reduce((sum: number, current: Occurrence) => sum + current.total, 0);
  }

  ngOnInit(): void {
    this._transactionService.get().subscribe((transactions: Transaction[]) => {
      this._transactions = transactions;
      this.occurrences = OccurrenceFinder.findOccurrences(this._transactions, this.firstDay, this.lastDay);
      this._runningTotal = new RunningTotal(this.occurrences, this.startingAmount);
    });
  }

  getRunningTotal(occurenceIndex: number, transactionIndex: number): number {
    return this._runningTotal.getTotal(occurenceIndex, transactionIndex);
  }

  private _extractTransactions(occurrences: Occurrence[]): Transaction[] {
    const transactions: Transaction[] = [];

    for (const occurrence of occurrences) {
      occurrence.transactions.forEach((t: Transaction) => transactions.push(t));
    }

    return transactions;
  }

  private _getTransactionSum(transactions: Transaction[]): number {
    return transactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  }
}
