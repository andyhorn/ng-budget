import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Recurrence } from '../models/recurrence';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private _transactions: Transaction[] = [];

  constructor() {
    this._transactions.push({
      id: 1,
      title: 'Expense 1',
      amount: 100.00,
      isExpense: true,
      recurrence: new Recurrence(),
    });

    this._transactions.push({
      id: 2,
      title: 'Paycheck',
      amount: 1200.00,
      isExpense: false,
      recurrence: new Recurrence(),
    });

    this._transactions.push({
      id: 3,
      title: 'Expense 2',
      amount: 50,
      isExpense: true,
      recurrence: new Recurrence(),
    });

    this._transactions.push({
      id: 4,
      title: 'Expense 3',
      amount: 125,
      isExpense: true,
      recurrence: new Recurrence(),
    });
  }

  get(): Observable<Transaction[]> {
    return from([this._transactions]);
  }

  find(id: number): Observable<Transaction | null> {
    return from([this._transactions.find(t => t.id == id) || null]);
  }

  add(transaction: Transaction): void {
    transaction.id = this._findNextId();

    this._transactions.push(transaction);
  }

  delete(id: number): void {
    const index: number = this._transactions.findIndex((t: Transaction) => t.id == id);

    if (index > -1) {
      this._transactions.splice(index, 1);
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
}
