import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewTransactionDialogComponent } from '../components/new-transaction-dialog/new-transaction-dialog.component';
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
    private _state: AppStateService,
    private _dialog: MatDialog
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
    this._dialog.open(NewTransactionDialogComponent, {
      data: false,
    });
  }

  onNewExpenseClick(): void {
    this._dialog.open(NewTransactionDialogComponent, {
      data: true,
    });
  }

  onDelete(id: number): void {
    this._state.removeTransaction(id);
  }
}
