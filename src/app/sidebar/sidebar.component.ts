import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { Transaction } from '../models/transaction';
import { TransactionService } from '../services/transaction.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
  public incomeTransactions: Transaction[] = [];
  public expenseTransactions: Transaction[] = [];

  constructor(private _transactionService: TransactionService) { }

  getIncomeTransactions(): Observable<Transaction[]> {
    return this._transactionService.get().pipe(
      map((transactions: Transaction[]) =>
        transactions.filter((t: Transaction) => !t.isExpense))
    );
  }

  getExpenseTransactions(): Observable<Transaction[]> {
    return this._transactionService.get().pipe(
      map((transactions: Transaction[]) =>
        transactions.filter((t: Transaction) => t.isExpense))
    );
  }

  ngOnInit(): void {

  }

  onDelete(id: number): void {
    this._transactionService.delete(id);
  }
}
