export class Recurrence {
  private _startDate!: Date;
  public frequency: Frequency;
  public interval: number;

  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(date: Date) {
    if (!date){
      return;
    }

    if (typeof date != typeof Date) {
      date = new Date(date);
    }

    this._startDate = date;
    this._startDate.setHours(0, 0, 0, 0);
  }

  constructor() {
    this.startDate = new Date();
    this._startDate.setHours(0, 0, 0, 0);
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
