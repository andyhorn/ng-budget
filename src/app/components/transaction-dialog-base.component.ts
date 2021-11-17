import { Frequency } from "../models/recurrence";

export abstract class TransactionDialogBase {
  public title: string = '';
  public amount: number = 0;
  public frequency: Frequency = Frequency.Once;
  public interval: number = 0;
  public startDate: Date = new Date();
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

  get canSave(): boolean {
    return this.title.trim()?.length > 0;
  }

  constructor() {
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
}

export interface FrequencyDisplay {
  name: string;
  value: number;
}
