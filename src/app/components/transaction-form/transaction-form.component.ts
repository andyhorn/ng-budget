import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Frequency } from 'src/app/models/recurrence';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.sass']
})
export class TransactionFormComponent implements OnInit {
  @Input() public title!: string;
  @Output() public titleChange = new EventEmitter<string>();
  @Input() public amount!: number;
  @Output() public amountChange = new EventEmitter<number>();
  @Input() public frequency!: Frequency;
  @Output() public frequencyChange = new EventEmitter<Frequency>();
  @Input() public interval!: number;
  @Output() public intervalChange = new EventEmitter<number>();
  @Input() public startDate!: Date;
  @Output() public startDateChange = new EventEmitter<Date>();
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

  constructor() { }

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

  public updateTitle(): void {
    this.titleChange.emit(this.title);
  }

  public updateAmount(): void {
    this.amountChange.emit(this.amount);
  }

  public updateFrequency(): void {
    this.frequencyChange.emit(this.frequency);
  }

  public updateInterval(): void {
    this.intervalChange.emit(this.interval);
  }

  public updateStartDate(): void {
    this.startDateChange.emit(this.startDate);
  }
}

export interface FrequencyDisplay {
  name: string;
  value: number;
}
