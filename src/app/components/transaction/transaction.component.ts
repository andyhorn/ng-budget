import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Frequency } from 'src/app/models/recurrence';
import { Transaction } from 'src/app/models/transaction';
import { AppStateService } from 'src/app/services/state/app-state.service';

interface FrequencyDisplay {
  name: string;
  value: number;
}

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
  public frequencies!: FrequencyDisplay[];
  public isExpanded: boolean = false;
  private _id!: number;

  constructor(
    private _state: AppStateService
  ) {
    this.delete = new EventEmitter<void>();
  }

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

  ngOnInit() {
    this.frequencies = Object.values(Frequency)
      .map((val: any) => Number(val))
      .filter((val: any) => !isNaN(val))
      .map(val => {
        return {
          name: Frequency[val],
          value: val,
        };
      });

    this._id = this.transaction.id;
    this.isExpense = this.transaction.isExpense;
    this.amount = this.transaction.amount;
    this.frequency = this.transaction.recurrence.frequency;
    this.interval = this.transaction.recurrence.interval;
    this.startDate = this.transaction.recurrence.startDate;
    this.title = this.transaction.title;
  }

  onClickDelete(): void {
    this.delete.emit();
  }

  onSaveClick(): void {
    const update: Transaction = new Transaction(this.title, this.amount, this.isExpense);
    update.id = this._id;
    update.recurrence.frequency = this.frequency;
    update.recurrence.interval = this.interval;
    update.recurrence.startDate = this.startDate;

    this._state.updateTransaction(update);
  }
}
