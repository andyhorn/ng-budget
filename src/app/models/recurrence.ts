export class Recurrence {
  startDate: Date;
  frequency: Frequency;
  interval: number;

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
