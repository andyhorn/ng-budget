import { Component, Input, OnInit } from '@angular/core';
import { Occurence } from '../models/occurence';
import { Transaction } from '../models/transaction';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.sass']
})
export class CalendarComponent implements OnInit {
  @Input() firstDay!: Date;
  @Input() lastDay!: Date;
  @Input() startingAmount!: number;
  private _transactions: Transaction[] = [];

  constructor(private _transactionService: TransactionService) { }

  get occurrences(): Occurence[] {
    const occurences: Occurence[] = [];
    let current: Date = new Date(this.firstDay);

    while (current <= this.lastDay) {
      const transactions: Transaction[] = this._transactions
        .filter((t: Transaction) => t.occursOn(current));

      if (transactions.length) {
        const occurence: Occurence = new Occurence(current, transactions);
        occurences.push(occurence);
      }

      current = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate() + 1,
        0, 0, 0, 0
      );
    }

    return occurences;
  }

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
    return this.occurrences.reduce((sum: number, current: Occurence) => sum + current.total, 0);
  }

  ngOnInit(): void {
    this._transactionService.get().subscribe((transactions: Transaction[]) => {
      this._transactions = transactions;
    });
  }

  getRunningTotal(occurenceIndex: number, transactionIndex: number): number {
    let total: number = this.startingAmount;

    for (let o = 0; o <= occurenceIndex; o++) {
      const occurrence: Occurence = this.occurrences[o];

      for (let t = 0; t < occurrence.transactions.length; t++) {
        const transaction: Transaction = occurrence.transactions[t];

        if (transaction.isExpense) {
          total -= transaction.amount;
        } else {
          total += transaction.amount;
        }

        if (t == transactionIndex && o == occurenceIndex) {
          break;
        }
      }
    }

    return total;
  }

  private _extractTransactions(occurrences: Occurence[]): Transaction[] {
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
