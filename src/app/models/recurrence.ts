export class Recurrence {
  private _startDate!: Date;
  frequency: Frequency;
  interval: number;

  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(date: Date) {
    date.setHours(0, 0, 0, 0);
    this._startDate = date;
  }

  constructor() {
    this.startDate = new Date();
    this.frequency = Frequency.Once;
    this.interval = 1;
  }
}

export enum Frequency {
  Once,
  Daily,
  Weekly,
  Monthly,
  Yearly,
}
