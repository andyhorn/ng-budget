import { Component, OnInit } from '@angular/core';
import { Occurence } from '../models/occurence';
import { Transaction } from '../models/transaction';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.sass']
})
export class CalendarComponent implements OnInit {
  public today: Date = new Date();
  public firstDay: Date = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    1,
    0, 0, 0, 0);
  public lastDay: Date = new Date(
    this.today.getFullYear(),
    this.today.getMonth() + 1,
    0,
    0, 0, 0, 0);
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

  get netFlow(): number {
    return this.occurrences.reduce((sum: number, current: Occurence) => sum + current.total, 0);
  }

  ngOnInit(): void {
    this._transactionService.get().subscribe((transactions: Transaction[]) => {
      this._transactions = transactions;
    });
  }

}
