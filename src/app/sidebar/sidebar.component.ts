import { Component, OnInit } from '@angular/core';
import { Transaction } from '../models/transaction';
import { AppStateService } from '../services/state/app-state.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
  public incomeTransactions: Transaction[] = [];
  public expenseTransactions: Transaction[] = [];

  constructor(
    private _state: AppStateService
    ) { }

  get totalIncomeAmount(): number {
    return this.getTransactionSum(this.incomeTransactions);
  }

  get totalExpenseAmount(): number {
    return this.getTransactionSum(this.expenseTransactions);
  }

  getTransactionSum(list: Transaction[]): number {
    return list.reduce((sum: number, current: Transaction) => sum + current.amount, 0);
  }

  ngOnInit(): void {
    this._state.transactions$.subscribe((transactions: Transaction[]) => {
      this.incomeTransactions = transactions.filter((t: Transaction) => !t.isExpense);
      this.expenseTransactions = transactions.filter((t: Transaction) => t.isExpense);
    });
  }

  onNewIncomeClick(): void {
    const newTransaction: Transaction = new Transaction('New income', 0, false);

    this._state.addTransaction(newTransaction);
  }

  onNewExpenseClick(): void {
    const newTransaction: Transaction = new Transaction('New expense', 0, true);

    this._state.addTransaction(newTransaction);
  }

  onDelete(id: number): void {
    this._state.removeTransaction(id);
  }
}
