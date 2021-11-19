import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditTransactionDialogData } from 'src/app/models/edit-transaction-dialog-data';
import { Frequency } from 'src/app/models/recurrence';
import { Transaction } from 'src/app/models/transaction';
import { AppStateService } from 'src/app/services/state/app-state.service';

@Component({
  selector: 'app-edit-transaction-dialog',
  templateUrl: './edit-transaction-dialog.component.html',
  styleUrls: ['./edit-transaction-dialog.component.sass']
})
export class EditTransactionDialogComponent {
  public title!: string;
  public amount!: number;
  public frequency!: Frequency;
  public interval!: number;
  public isExpense!: boolean;
  public startDate!: Date;

  private _transactionId: number = 0;

  constructor(
    private _state: AppStateService,
    private _ref: MatDialogRef<EditTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: EditTransactionDialogData
  ) {
    this._transactionId = data.id;
    this.isExpense = data.isExpense;

    if (!data.isNew) {
      this._transactionId = data.id;
      this._fetchTransactionData();
    } else {
      this.title = '';
      this.amount = 0;
      this.frequency = Frequency.Monthly;
      this.interval = 1;
      this.startDate = new Date();
      this.startDate.setHours(0, 0, 0, 0);
    }
  }

  get canSave(): boolean {
    return this.title.trim()?.length > 0;
  }

  public onSaveClick(): void {
    const transaction: Transaction = this._build();

    if (transaction.id === 0) {
      this._state.addTransaction(transaction);
    } else {
      this._state.updateTransaction(transaction);
    }

    this._ref.close();
  }

  private _fetchTransactionData(): void {
    const transaction: Transaction | undefined = this._state.transactions.find((t: Transaction) => t.id === this._transactionId);

    if (!transaction) {
      alert('An error occurred opening the transaction for edit!');
      this._ref.close();
      return;
    }

    this._parse(transaction);
  }

  private _parse(transaction: Transaction): void {
    this._transactionId = transaction.id;
    this.amount = transaction.amount;
    this.title = transaction.title;
    this.isExpense = transaction.isExpense;
    this.frequency = transaction.recurrence.frequency;
    this.interval = transaction.recurrence.interval;
    this.startDate = transaction.recurrence.startDate;
  }

  private _build(): Transaction {
    const transaction: Transaction = new Transaction(this.title, this.amount, this.isExpense);

    transaction.id = this._transactionId;
    transaction.recurrence.frequency = this.frequency;
    transaction.recurrence.interval = this.interval;
    transaction.recurrence.startDate = this.startDate;

    return transaction;
  }
}
