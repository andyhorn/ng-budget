export class Recurrence {
  startDate: Date;
  frequency: Frequency;
  interval: number;

  constructor() {
    const now: Date = new Date();
    this.startDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0, 0, 0, 0
    );
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
