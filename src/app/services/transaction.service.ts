import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private _transactions: Transaction[] = [];
  private _transactionSubject: BehaviorSubject<Transaction[]> =
    new BehaviorSubject<Transaction[]>(this._transactions);

  constructor() {
    this.add(new Transaction('Expense 1', 100.0));
    this.add(new Transaction('Paycheck 1', 1200.0, false));
    this.add(new Transaction('Expense 2', 50.0));
    this.add(new Transaction('Expense 3', 125.00));
  }

  get(): Observable<Transaction[]> {
    return this._transactionSubject.asObservable();
  }

  find(id: number): Observable<Transaction | null> {
    return from([this._transactions.find(t => t.id == id) || null]);
  }

  add(transaction: Transaction): void {
    transaction.id = this._findNextId();
    this._transactions.push(transaction);
    this._trigger();
  }

  delete(id: number): void {
    const index: number = this._transactions.findIndex((t: Transaction) => t.id == id);

    if (index > -1) {
      this._transactions.splice(index, 1);
      this._trigger();
    }
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

  private _trigger(): void {
    this._transactionSubject.next(this._transactions);
  }
}
