import { DatePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTransactionDialogData, EditTransactionDialogTypes } from 'src/app/models/edit-transaction-dialog-data';
import { Transaction, TransactionTypes } from 'src/app/models/transaction';
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
  public cardClass: string = '';

  constructor(
    private _state: AppStateService,
    private _dialog: MatDialog
  ) {
    this.delete = new EventEmitter<void>();
  }

  public get skipList(): string {
    const datePipe: DatePipe = new DatePipe('en-US');
    const dateStrings: string[] = this.transaction.skip
      .map((s: Date) => <string>datePipe.transform(s));

    if (dateStrings.length === 1) {
      return dateStrings[0];
    }

    if (dateStrings.length === 2) {
      return dateStrings.join(' and ');
    }

    const last: string = <string>dateStrings.splice(-1)[0];
    let list: string = dateStrings.join(', ');
    list += ', and ' + last;

    return list;
  }

  public ngOnInit(): void {
    this.cardClass = this.transaction.type == TransactionTypes.Expense
      ? 'is-expense' : 'is-income';
  }

  public onDeleteClick(): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this._state.removeTransaction(this.transaction.id);
    }
  }

  public onEditClick(): void {
    this._dialog.open(EditTransactionDialogComponent, {
      width: '480px',
      data: new EditTransactionDialogData(
        this.transaction.id,
        EditTransactionDialogTypes.Edit,
        this.transaction.type),
    });
  }
}
