import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTransactionDialogComponent } from '../components/edit-transaction-dialog/edit-transaction-dialog.component';
import { EditTransactionDialogData, EditTransactionDialogTypes } from '../models/edit-transaction-dialog-data';
import { Transaction, TransactionTypes } from '../models/transaction';
import { AppStateService } from '../services/state/app-state.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent {
  public get incomeTransactions(): readonly Transaction[] {
    return this.state.transactions
      .filter((t: Transaction) => t.type == TransactionTypes.Income)
      .sort((a: Transaction, b: Transaction) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
  }

  public get expenseTransactions(): readonly Transaction[] {
    return this.state.transactions
      .filter((t: Transaction) => t.type == TransactionTypes.Expense)
      .sort((a: Transaction, b: Transaction) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
  }

  public get totalIncomeAmount(): number {
    return this.getTransactionSum(this.incomeTransactions);
  }

  public get totalExpenseAmount(): number {
    return this.getTransactionSum(this.expenseTransactions);
  }

  constructor(
    private state: AppStateService,
    private dialog: MatDialog
    ) { }

  public onNewIncomeClick(): void {
    this.openTransactionDialog(TransactionTypes.Income);
  }

  public onNewExpenseClick(): void {
    this.openTransactionDialog(TransactionTypes.Expense);
  }

  public onDelete(id: number): void {
    this.state.removeTransaction(id);
  }

  private getTransactionSum(list: readonly Transaction[]): number {
    return list.reduce((sum: number, current: Transaction) => sum + current.amount, 0);
  }

  private openTransactionDialog(transactionType: TransactionTypes): void {
    this.dialog.open(EditTransactionDialogComponent, {
      width: '480px',
      data: new EditTransactionDialogData(
        0,
        EditTransactionDialogTypes.New,
        transactionType),
    });
  }
}
