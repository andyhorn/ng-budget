import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Transaction } from 'src/app/models/transaction';
import { AppStateService } from 'src/app/services/state/app-state.service';
import { TransactionDialogBase } from '../transaction-dialog-base.component';

@Component({
  selector: 'app-new-transaction-dialog',
  templateUrl: './new-transaction-dialog.component.html',
  styleUrls: ['./new-transaction-dialog.component.sass']
})
export class NewTransactionDialogComponent extends TransactionDialogBase {
  constructor(
    private _state: AppStateService,
    private _ref: MatDialogRef<NewTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public isExpense: boolean
  ) {
    super();
   }

  public onSaveClick(): void {
    const transaction: Transaction = new Transaction(
      this.title,
      this.amount,
      this.isExpense
    );

    transaction.recurrence.frequency = this.frequency;
    transaction.recurrence.interval = this.interval;
    transaction.recurrence.startDate = this.startDate;

    this._state.addTransaction(transaction);
    this._ref.close();
  }
}
