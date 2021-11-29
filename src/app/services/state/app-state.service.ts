import { Injectable } from '@angular/core';
import { Occurrence } from 'src/app/models/occurrence';
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

  public runningTotalThreshold: number = 0;

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
     this.updateRunningTotal();
   }

   public set startDate(date: Date) {
    date.setHours(0, 0, 0, 0);

    if (date == this._startDate) {
      return;
    }

    this._startDate = date;

    this.recalculateOccurrences();
    this.updateRunningTotal();
   }

   public set endDate(date: Date) {
    date.setHours(0, 0, 0, 0);

    if (date == this._endDate) {
      return;
    }

    this._endDate = date;

    this.recalculateOccurrences();
    this.updateRunningTotal();
   }

   public clearTransactions(): void {
     this._transactions = [];
     this._occurrences = [];
     this._runningTotal = new RunningTotal([]);
   }

   public addTransaction(transaction: Transaction): void {
    if (transaction.id === 0) {
      transaction.id = this.findNextId();
    }

    this._transactions.push(transaction);
    this.addTransactionToOccurrences(transaction);
    this.sortOccurrences();
    this.updateRunningTotal();
   }

   public addTransactions(transactions: Transaction[]): void {
     transactions.forEach((t: Transaction) => {
       if (t.id === 0) {
         t.id = this.findNextId();
       }
     });

     this._transactions = this._transactions.concat(transactions);
     this.recalculateOccurrences();
     this.updateRunningTotal();
   }

   public updateTransaction(transaction: Transaction): void {
    const index: number = this.findTransactionIndex(transaction.id);

    if (index === -1) {
      return;
    }

    this._transactions[index] = transaction;
    this.removeTransactionFromOccurrences(transaction.id);
    this.addTransactionToOccurrences(transaction);
    this.pruneEmptyOccurrences();
    this.sortOccurrences();
    this.updateRunningTotal();
   }

   public removeTransaction(id: number): void {
     const index: number = this.findTransactionIndex(id);

      if (index === -1) {
        return;
      }

      this._transactions = this._transactions.filter((t: Transaction) => t.id !== id);
      this.removeTransactionFromOccurrences(id);
      this.pruneEmptyOccurrences();

      this.updateRunningTotal();
   }

   private updateRunningTotal(): void {
     this._runningTotal = new RunningTotal(this._occurrences, this._startingAmount);
   }

   private sortOccurrences(): void {
     this._occurrences.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
   }

   private recalculateOccurrences(): void {
     this._occurrences = OccurrenceFinder.findOccurrences(this._transactions, this._startDate, this._endDate);
   }

   private pruneEmptyOccurrences(): void {
     const hasAny: boolean = this._occurrences.some((o: Occurrence) => o.transactions.length === 0);

     if (!hasAny) {
       return;
     }

     this._occurrences = this._occurrences.filter((o: Occurrence) => o.transactions.length);
   }

   private removeTransactionFromOccurrences(id: number): void {
     for (let i = 0; i < this._occurrences.length; i++) {
      const transactionIndex: number = this._occurrences[i].transactions.findIndex((t: Transaction) => t.id === id);

      if (transactionIndex === -1) {
        continue;
      }

      const updated: Occurrence = this.makeOccurrenceWithoutTransaction(this._occurrences[i], id);
      this._occurrences[i] = updated;
     }
   }

   private addTransactionToOccurrences(transaction: Transaction): void {
    const transactionOccurrences: Occurrence[] =
      OccurrenceFinder.findOccurrences([transaction], this._startDate, this._endDate);

    for (const occurrence of transactionOccurrences) {
      const index: number =
        this._occurrences.findIndex((o: Occurrence) => this.areSameDate(o.date, occurrence.date));

      if (index === -1) {
        this._occurrences.push(occurrence);
      } else {
        const updated: Occurrence = this.makeOccurrenceWithTransaction(this._occurrences[index], transaction);
        this._occurrences[index] = updated;
      }
    }
   }

   private makeOccurrenceWithoutTransaction(occurrence: Occurrence, id: number): Occurrence {
    return new Occurrence(
      occurrence.date,
      occurrence.transactions.filter((t: Transaction) => t.id !== id)
    );
   }

   private makeOccurrenceWithTransaction(occurrence: Occurrence, transaction: Transaction): Occurrence {
     return new Occurrence(
       occurrence.date,
       [...occurrence.transactions, transaction],
     );
   }

   private areSameDate(a: Date, b: Date): boolean {
     return a.getFullYear() == b.getFullYear() &&
      a.getMonth() == b.getMonth() &&
      a.getDate() == b.getDate();
   }

   private findTransactionIndex(id: number): number {
     return this._transactions.findIndex((t: Transaction) => t.id === id);
   }

   private findNextId(): number {
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
