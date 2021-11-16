import { Component, OnInit } from '@angular/core';
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

  constructor(
    private _transactionService: TransactionService) { }

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
    this._transactionService.get().subscribe((transactions: Transaction[]) => {
      this.incomeTransactions = transactions.filter((t: Transaction) => !t.isExpense);
      this.expenseTransactions = transactions.filter((t: Transaction) => t.isExpense);
    });
  }

  onNewIncomeClick(): void {
    const newTransaction: Transaction = new Transaction('New income', 0, false);

    this._transactionService.add(newTransaction);
  }

  onNewExpenseClick(): void {
    const newTransaction: Transaction = new Transaction('New expense', 0, true);

    this._transactionService.add(newTransaction);
  }

  onDelete(id: number): void {
    this._transactionService.delete(id);
  }
}
