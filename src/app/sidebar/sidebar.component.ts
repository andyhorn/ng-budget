import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTransactionDialogComponent } from '../components/edit-transaction-dialog/edit-transaction-dialog.component';
import { EditTransactionDialogData } from '../models/edit-transaction-dialog-data';
import { Transaction } from '../models/transaction';
import { AppStateService } from '../services/state/app-state.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent {
  public get incomeTransactions(): readonly Transaction[] {
    return this._state.transactions
      .filter((t: Transaction) => !t.isExpense)
      .sort((a: Transaction, b: Transaction) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
  }

  public get expenseTransactions(): readonly Transaction[] {
    return this._state.transactions
      .filter((t: Transaction) => t.isExpense)
      .sort((a: Transaction, b: Transaction) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
  }

  public get totalIncomeAmount(): number {
    return this._getTransactionSum(this.incomeTransactions);
  }

  public get totalExpenseAmount(): number {
    return this._getTransactionSum(this.expenseTransactions);
  }

  constructor(
    private _state: AppStateService,
    private _dialog: MatDialog
    ) { }

  public onNewIncomeClick(): void {
    this._launchNewTransactionDialog(false);
  }

  public onNewExpenseClick(): void {
    this._launchNewTransactionDialog(true);
  }

  public onDelete(id: number): void {
    this._state.removeTransaction(id);
  }

  private _getTransactionSum(list: readonly Transaction[]): number {
    return list.reduce((sum: number, current: Transaction) => sum + current.amount, 0);
  }

  private _launchNewTransactionDialog(isExpense: boolean): void {
    this._dialog.open(EditTransactionDialogComponent, {
      width: '480px',
      data: new EditTransactionDialogData(0, true, isExpense),
    });
  }
}
