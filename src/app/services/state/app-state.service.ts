import { Injectable } from '@angular/core';
import { Occurrence } from 'src/app/models/occurernce';
import { RunningTotal } from 'src/app/models/running-total';
import { Transaction } from 'src/app/models/transaction';
import { OccurrenceFinder } from 'src/app/utilities/occurrence-finder';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private _transactions: Transaction[] = [];
  private _occurrences: Occurrence[] = [];
  private _runningTotal: RunningTotal = new RunningTotal([]);
  private _startDate: Date;
  private _endDate: Date;
  private _startingAmount: number = 0;

  constructor() {
    const today: Date = new Date();
    this._startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      1, 0, 0, 0, 0
    );
    this._endDate = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0, 0, 0, 0, 0
    );
   }

   public get transactions(): ReadonlyArray<Transaction> {
     return this._transactions;
   }

   public get occurrences(): ReadonlyArray<Occurrence> {
     return this._occurrences;
   }

   public get runningTotal(): RunningTotal {
     return this._runningTotal;
   }

   public get startingAmount(): number {
     return this._startingAmount;
   }

   public get startDate(): Date {
     return this._startDate;
   }

   public get endDate(): Date {
     return this._endDate;
   }

   public set startingAmount(amount: number) {
     if (this._startingAmount == amount) {
       return;
     }

     this._startingAmount = amount;
     this._updateRunningTotal();
   }

   public set startDate(date: Date) {
    date.setHours(0, 0, 0, 0);

    if (date == this._startDate) {
      return;
    }

    this._startDate = date;

    this._recalculateOccurrences();
    this._updateRunningTotal();
   }

   public set endDate(date: Date) {
    date.setHours(0, 0, 0, 0);

    if (date == this._endDate) {
      return;
    }

    this._endDate = date;

    this._recalculateOccurrences();
    this._updateRunningTotal();
   }

   public setTransactions(transactions: Transaction[]): void {
     this._transactions = transactions;
     this._recalculateOccurrences();
     this._updateRunningTotal();
   }

   public addTransaction(transaction: Transaction): void {
    const id: number = this._findNextId();
    transaction.id = id;

    this._transactions.push(transaction);
    this._addTransactionOccurrences(transaction);
    this._sortOccurrences();

    this._updateRunningTotal();
   }

   public updateTransaction(transaction: Transaction): void {
    const index: number = this._findTransactionIndex(transaction.id);

    if (index === -1) {
      return;
    }

    this._transactions[index] = transaction;
    this._removeTransactionOccurrences(transaction.id);
    this._addTransactionOccurrences(transaction);
    this._pruneEmptyOccurrences();
    this._sortOccurrences();

    this._updateRunningTotal();
   }

   public removeTransaction(id: number): void {
     const index: number = this._findTransactionIndex(id);

      if (index === -1) {
        return;
      }

      this._transactions.splice(index, 1);
      this._removeTransactionOccurrences(id);
      this._pruneEmptyOccurrences();

      this._updateRunningTotal();
   }

   private _updateRunningTotal(): void {
     this._runningTotal = new RunningTotal(this._occurrences, this._startingAmount);
   }

   private _sortOccurrences(): void {
     this._occurrences.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);

     for (let i = 0; i < this._occurrences.length; i++) {
       if (this._occurrences[i].transactions.length === 1) {
         continue;
       }

       this._occurrences[i].transactions.sort((a, b) => a.id - b.id);
     }
   }

   private _recalculateOccurrences(): void {
     this._occurrences = OccurrenceFinder.findOccurrences(this._transactions, this._startDate, this._endDate);
   }

   private _pruneEmptyOccurrences(): void {
     for (let i = this._occurrences.length - 1; i >= 0; i--) {
       if (this._occurrences[i].transactions.length) {
         continue;
       }

       this._occurrences.splice(i, 1);
     }
   }

   private _removeTransactionOccurrences(id: number): void {
    for (const occurrence of this._occurrences) {
      const index: number = occurrence.transactions.findIndex((t: Transaction) => t.id === id);

      if (index === -1) {
        continue;
      }

      const transactions: Transaction[] = [...occurrence.transactions];
      transactions.splice(index, 1);
      occurrence.transactions = transactions;
    }
   }

   private _addTransactionOccurrences(transaction: Transaction): void {
    const transactionOccurrences: Occurrence[] =
      OccurrenceFinder.findOccurrences([transaction], this._startDate, this._endDate);

    for (const occurrence of transactionOccurrences) {
      const index: number =
        this._occurrences.findIndex((o: Occurrence) => this._areSameDate(o.date, occurrence.date));

      if (index === -1) {
        this._occurrences.push(occurrence);
      } else {
        const existing: Occurrence = this._occurrences[index];
        existing.transactions = [...existing.transactions, transaction];
        this._occurrences[index] = existing;
      }
    }
   }

   private _areSameDate(a: Date, b: Date): boolean {
     return a.getFullYear() == b.getFullYear() &&
      a.getMonth() == b.getMonth() &&
      a.getDate() == b.getDate();
   }

   private _findTransactionIndex(id: number): number {
     return this._transactions.findIndex((t: Transaction) => t.id === id);
   }

   private _findNextId(): number {
    let id: number = 1;

    if (!this._transactions.length) {
      return id;
    }

    while (this._transactions.some((t: Transaction) => t.id == id)) {
      id++;
    }

    return id;
  }
}
