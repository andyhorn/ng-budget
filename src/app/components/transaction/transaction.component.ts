import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Frequency } from 'src/app/models/recurrence';
import { Transaction } from 'src/app/models/transaction';

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
  public frequencies!: FrequencyDisplay[];
  public isExpanded: boolean = false;

  constructor() {
    this.delete = new EventEmitter<void>();
  }

  get frequencyDisplay(): string {
    switch (this.transaction.recurrence.frequency) {
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
  }

  onClickDelete(): void {
    this.delete.emit();
  }
}
