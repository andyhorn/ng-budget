export class Recurrence {
  private _startDate!: Date;
  private _interval: number;
  public frequency: Frequency;

  public get startDate(): Date {
    return this._startDate;
  }

  public get interval(): number {
    return this._interval;
  }

  public set interval(value: number) {
    if (value < 1) {
      throw 'Invalid value; must be greater than or equal to 1';
    }

    this._interval = value;
  }

  public set startDate(date: Date) {
    this._startDate = date;
    this._startDate.setHours(0, 0, 0, 0);
  }

  constructor() {
    this.startDate = new Date();
    this._startDate.setHours(0, 0, 0, 0);
    this.frequency = Frequency.Once;
    this._interval = 1;
  }
}

export enum Frequency {
  Once,
  Daily,
  Weekly,
  Monthly,
  Yearly,
}
