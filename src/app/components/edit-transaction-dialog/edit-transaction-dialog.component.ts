import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Frequency } from 'src/app/models/recurrence';
import { Transaction } from 'src/app/models/transaction';
import { AppStateService } from 'src/app/services/state/app-state.service';
import { TransactionDialogBase } from '../transaction-dialog-base.component';

@Component({
  selector: 'app-edit-transaction-dialog',
  templateUrl: './edit-transaction-dialog.component.html',
  styleUrls: ['./edit-transaction-dialog.component.sass']
})
export class EditTransactionDialogComponent extends TransactionDialogBase implements OnInit {
  public title!: string;
  public amount!: number;
  public frequency!: Frequency;
  public interval!: number;
  public isExpense!: boolean;
  public startDate!: Date;

  constructor(
    private _state: AppStateService,
    private _ref: MatDialogRef<EditTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _id: number
  ) {
    super();
  }

  ngOnInit(): void {
    const transaction: Transaction | undefined = this._state.transactions.find((t: Transaction) => t.id === this._id);

    if (!transaction) {
      alert('An error occurred opening the transaction for edit!');
      this._ref.close();
      return;
    }

    this.title = transaction.title;
    this.amount = transaction.amount;
    this.frequency = transaction.recurrence.frequency;
    this.interval = transaction.recurrence.interval;
    this.isExpense = transaction.isExpense;
    this.startDate = transaction.recurrence.startDate;
  }

  public onSaveClick(): void {
    const transaction: Transaction = new Transaction(this.title, this.amount, this.isExpense);
    transaction.id = this._id;
    transaction.recurrence.frequency = this.frequency;
    transaction.recurrence.interval = this.interval;
    transaction.recurrence.startDate = this.startDate;

    this._state.updateTransaction(transaction);
    this._ref.close();
  }
}
