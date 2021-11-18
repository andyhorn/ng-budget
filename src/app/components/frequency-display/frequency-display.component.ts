import { Component, Input } from '@angular/core';
import { Frequency } from 'src/app/models/recurrence';

@Component({
  selector: 'app-frequency-display',
  templateUrl: './frequency-display.component.html',
  styleUrls: ['./frequency-display.component.sass']
})
export class FrequencyDisplayComponent {
  @Input() frequency!: number;
  @Input() interval!: number;
  @Input() date!: Date;

  constructor() { }

  get display(): string {
    switch (this.frequency) {
      case Frequency.Once:
        return 'once';
      case Frequency.Daily:
        return this._makeString('daily', 'days');
      case Frequency.Weekly:
        return this._makeString('weekly', 'weeks') +
          ' on ' +
          this._getDayOfWeek(this.date.getDay()) +
          ',';
      case Frequency.Monthly:
        return this._makeString('monthly', 'months') +
          ' on the ' +
          this.date.getDate() +
          this._getDateSuffix(this.date.getDate()) +
          ',';
      case Frequency.Yearly:
        return this._makeString('yearly', 'years') +
          ' on ' +
          this._getMonth(this.date.getMonth()) +
          ' ' +
          this.date.getDate() +
          this._getDateSuffix(this.date.getDate());
      default:
        return '';
    }
  }

  private _makeString(single: string, multiple: string): string {
    return this.interval === 1
      ? single
      : `every ${this.interval} ${multiple}`;
  }

  private _getDayOfWeek(date: number): string {
    switch (date) {
      case 0: return 'Sunday';
      case 1: return 'Monday';
      case 2: return 'Tuesday';
      case 3: return 'Wednesday';
      case 4: return 'Thursday';
      case 5: return 'Friday';
      case 6: return 'Saturday';
      default: return '';
    }
  }

  private _getMonth(month: number): string {
    switch (month) {
      case 0: return 'January';
      case 1: return 'February';
      case 2: return 'March';
      case 3: return 'April';
      case 4: return 'May';
      case 5: return 'June';
      case 6: return 'July';
      case 7: return 'August';
      case 8: return 'September';
      case 9: return 'October';
      case 10: return 'November';
      case 11: return 'December';
      default: return '';
    }
  }

  private _getDateSuffix(date: number): string {
    if (date % 100 >= 11 && date % 100 <= 13) {
      return 'th';
    }

    switch (date % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
}
