import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditTransactionDialogComponent } from '../components/edit-transaction-dialog/edit-transaction-dialog.component';
import { EditTransactionDialogData } from '../models/edit-transaction-dialog-data';
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
    this._dialog.open(EditTransactionDialogComponent, {
      width: '480px',
      data: new EditTransactionDialogData(0, true, false),
    });
  }

  onNewExpenseClick(): void {
    this._dialog.open(EditTransactionDialogComponent, {
      width: '480px',
      data: new EditTransactionDialogData(0, true, true),
    });
  }

  onDelete(id: number): void {
    this._state.removeTransaction(id);
  }
}
