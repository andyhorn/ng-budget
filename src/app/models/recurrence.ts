export class Recurrence {
  startDate: Date;
  frequency: Frequency;

  constructor() {
    this.startDate = new Date();
    this.frequency = Frequency.Once;
  }
}

export enum Frequency {
  Once,
  Daily,
  Weekly,
  Monthly,
  Yearly,
}
