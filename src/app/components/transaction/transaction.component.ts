import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Frequency } from 'src/app/models/recurrence';
import { Transaction } from 'src/app/models/transaction';
import { AppStateService } from 'src/app/services/state/app-state.service';
import { EditTransactionDialogComponent } from '../edit-transaction-dialog/edit-transaction-dialog.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.sass']
})
export class TransactionComponent implements OnInit {
  @Input() transaction!: Transaction;
  @Output() delete: EventEmitter<void>;
  public amount: number = 0;
  public frequency!: Frequency;
  public interval: number = 0;
  public title: string = '';
  public startDate!: Date;
  public isExpense!: boolean;
  public isExpanded: boolean = false;
  private _id!: number;

  constructor(
    private _state: AppStateService,
    private _dialog: MatDialog
  ) {
    this.delete = new EventEmitter<void>();
  }

  ngOnInit() {
    this._id = this.transaction.id;
    this.isExpense = this.transaction.isExpense;
    this.amount = this.transaction.amount;
    this.frequency = this.transaction.recurrence.frequency;
    this.interval = this.transaction.recurrence.interval;
    this.startDate = this.transaction.recurrence.startDate;
    this.title = this.transaction.title;
  }

  public onDeleteClick(): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this._state.removeTransaction(this._id);
    }
  }

  public onEditClick(): void {
    this._dialog.open(EditTransactionDialogComponent, {
      width: '480px',
      data: this._id,
    });
  }
}
