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

  constructor() { }

  get display(): string {
    switch (this.frequency) {
      case Frequency.Once:
        return 'once';
      case Frequency.Daily:
        return this._makeString('daily', 'days');
      case Frequency.Weekly:
        return this._makeString('weekly', 'weeks');
      case Frequency.Monthly:
        return this._makeString('monthly', 'months');
      case Frequency.Yearly:
        return this._makeString('yearly', 'years');
      default:
        return '';
    }
  }

  private _makeString(single: string, multiple: string): string {
    return this.interval === 1
      ? single
      : `every ${this.interval} ${multiple}`;
  }
}
