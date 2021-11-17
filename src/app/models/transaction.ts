import { Frequency, Recurrence } from "./recurrence";

export class Transaction {
  id: number;
  title: string;
  isExpense: boolean;
  amount: number;
  recurrence: Recurrence;

  constructor(title: string = '', amount: number = 0,  isExpense: boolean = true) {
    this.id = 0;
    this.title = title;
    this.isExpense = isExpense;
    this.amount = amount;
    this.recurrence = new Recurrence();
  }

  public static fromJson(json: any): Transaction {
    const transaction: Transaction = new Transaction();

    transaction.amount = json.amount;
    transaction.id = json.id;
    transaction.isExpense = json.isExpense;
    transaction.title = json.title;
    transaction.recurrence.frequency = json.recurrence.frequency;
    transaction.recurrence.interval = json.recurrence.interval;
    transaction.recurrence.startDate = new Date(json.recurrence.startDate);

    return transaction;
  }

  public occursOn(date: Date): boolean {
    date.setHours(0, 0, 0, 0);

    if (date < this.recurrence.startDate) {
      return false;
    }

    switch (this.recurrence.frequency) {
      case Frequency.Once:
        return this._isSameDay(this.recurrence.startDate, date);
      case Frequency.Daily:
        const daysApart: number = this._getDaysApart(this.recurrence.startDate, date);
        return daysApart % this.recurrence.interval == 0;
      case Frequency.Weekly:
        if (this.recurrence.startDate.getDay() != date.getDay()) {
          return false;
        }

        const weeksApart: number = this._getWeeksApart(this.recurrence.startDate, date);
        return weeksApart % this.recurrence.interval == 0;
      case Frequency.Monthly:
        if (this.recurrence.startDate.getDate() != date.getDate()) {
          return false;
        }

        const monthsApart: number = this._getMonthsApart(this.recurrence.startDate, date);
        return monthsApart % this.recurrence.interval == 0;
      case Frequency.Yearly:
        if (this.recurrence.startDate.getMonth() != date.getMonth()) {
          return false;
        }

        if (this.recurrence.startDate.getDate() != date.getDate()) {
          return false;
        }

        const firstYear: number = (date < this.recurrence.startDate ? date : this.recurrence.startDate).getFullYear();
        const lastYear: number = (date < this.recurrence.startDate ? this.recurrence.startDate : date).getFullYear();

        return (lastYear - firstYear) % this.recurrence.interval == 0;
    }
  }

  private _getWeeksApart(a: Date, b: Date): number {
    return this._getDaysApart(a, b) / 7;
  }

  private _getMonthsApart(a: Date, b: Date): number {
    const first: Date = a < b ? a : b;
    const last: Date = a < b ? b : a;

    const fromMonth: number = first.getMonth();
    const fromYear: number = first.getFullYear();
    const toMonth: number = last.getMonth();
    const toYear: number = last.getFullYear();
    const yearDiff: number = toYear - fromYear;

    if (yearDiff === 0) {
      return toMonth - fromMonth;
    }

    const monthsToEndOfFromYear: number = 12 - fromMonth;
    const monthsToEndMonth: number = toMonth + monthsToEndOfFromYear;

    if (yearDiff === 1) {
      return monthsToEndMonth;
    }

    return monthsToEndMonth + (yearDiff - 1) * 12
  }

  private _getDaysApart(a: Date, b: Date): number {
    const first: Date = a < b ? a : b;
    const last: Date = a < b ? b : a;

    first.setHours(0, 0, 0, 0);
    last.setHours(0, 0, 0, 0);

    const msApart: number = last.getTime() - first.getTime();
    const daysApart: number = Math.floor(msApart / 1000 / 60 / 60 / 24);

    return daysApart;
  }

  private _isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() == b.getFullYear() &&
      a.getMonth() == b.getMonth() &&
      a.getDate() == b.getDate();
  }
}
