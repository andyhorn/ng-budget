import { Component, OnInit } from '@angular/core';
import { Occurrence } from 'src/app/models/occurrence';
import { Transaction } from 'src/app/models/transaction';
import { AppStateService } from 'src/app/services/state/app-state.service';

@Component({
  selector: 'app-finance-details',
  templateUrl: './finance-details.component.html',
  styleUrls: ['./finance-details.component.sass']
})
export class FinanceDetailsComponent implements OnInit {
  public get startingAmount(): number {
    return this.state.startingAmount;
  }

  public get finalAmount(): number {
    return this.startingAmount - this.totalExpenses + this.totalIncome;
  }

  public get totalExpenses(): number {
    const transactions: Transaction[] = this._extractTransactions(true);

    return this._getTransactionSum(transactions);
  }

  public get totalIncome(): number {
    const transactions: Transaction[] = this._extractTransactions(false);

    return this._getTransactionSum(transactions);
  }

  public get netFlow(): number {
    return this.state.occurrences.reduce((sum: number, current: Occurrence) => sum + current.total, 0);
  }

  constructor(
    private state: AppStateService
  ) { }

  ngOnInit(): void {
  }

  private _extractTransactions(isExpense: boolean): Transaction[] {
    return this.state.occurrences
      .map((o: Occurrence) => o.transactions)
      .reduce((list: Transaction[], current: Transaction[]) => list.concat(current), [])
      .filter((t: Transaction) => t.isExpense === isExpense);
  }

  private _getTransactionSum(transactions: Transaction[]): number {
    return transactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0);
  }
}
