import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTransactionDialogData } from 'src/app/models/edit-transaction-dialog-data';
import { Transaction } from 'src/app/models/transaction';
import { AppStateService } from 'src/app/services/state/app-state.service';
import { EditTransactionDialogComponent } from '../edit-transaction-dialog/edit-transaction-dialog.component';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.sass']
})
export class TransactionComponent {
  @Input() transaction!: Transaction;
  @Output() delete: EventEmitter<void>;

  constructor(
    private _state: AppStateService,
    private _dialog: MatDialog
  ) {
    this.delete = new EventEmitter<void>();
  }

  public onDeleteClick(): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this._state.removeTransaction(this.transaction.id);
    }
  }

  public onEditClick(): void {
    this._dialog.open(EditTransactionDialogComponent, {
      width: '480px',
      data: new EditTransactionDialogData(this.transaction.id, false, this.transaction.isExpense),
    });
  }
}
