import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Frequency } from 'src/app/models/recurrence';
import { Transaction } from 'src/app/models/transaction';
import { AppStateService } from 'src/app/services/state/app-state.service';

interface FrequencyDisplay {
  name: string;
  value: number;
}

@Component({
  selector: 'app-new-transaction-dialog',
  templateUrl: './new-transaction-dialog.component.html',
  styleUrls: ['./new-transaction-dialog.component.sass']
})
export class NewTransactionDialogComponent implements OnInit {
  public title: string = '';
  public amount: number = 0;
  public frequency: Frequency = Frequency.Once;
  public interval: number = 0;
  public startDate: Date = new Date();
  public frequencies: FrequencyDisplay[] = [];

  get frequencyDisplay(): string {
    switch (this.frequency) {
      case Frequency.Daily:
        return "days";
      case Frequency.Weekly:
        return "weeks";
      case Frequency.Monthly:
        return "months";
      case Frequency.Yearly:
        return "years";
      default:
        return "";
    }
  }

  get canSave(): boolean {
    return this.title.trim()?.length > 0;
  }

  constructor(
    private _state: AppStateService,
    private _ref: MatDialogRef<NewTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public isExpense: boolean
  ) { }

  ngOnInit(): void {
    this.frequencies = Object.values(Frequency)
      .map((val: any) => Number(val))
      .filter((val: any) => !isNaN(val))
      .map(val => {
        return {
          name: Frequency[val],
          value: val,
        };
      });
  }

  public onSaveClick(): void {
    const transaction: Transaction = new Transaction(
      this.title,
      this.amount,
      this.isExpense
    );

    transaction.recurrence = {
      frequency: this.frequency,
      interval: this.interval,
      startDate: this.startDate,
    };

    this._state.addTransaction(transaction);
    this._ref.close();
  }
}
