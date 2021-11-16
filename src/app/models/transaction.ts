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
    transaction.recurrence = {
      frequency: json.recurrence.frequency,
      interval: json.recurrence.interval,
      startDate: new Date(json.recurrence.startDate),
    };

    return transaction;
  }

  public occursOn(date: Date): boolean {
    date = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0, 0, 0, 0
    );

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
    let count: number = 0;
    let first: Date = a < b ? a : b;
    let last: Date = a < b ? b : a;

    while (first < last) {
      count++;
      first = new Date(
        first.getFullYear(),
        first.getMonth(),
        first.getDate() + 7,
        0, 0, 0, 0
      );
    }

    return count;
  }

  private _getMonthsApart(a: Date, b: Date): number {
    let count: number = 0;
    let first: Date = a < b ? a : b;
    let last: Date = a < b ? b : a;

    while (first < last) {
      count ++;
      first = new Date(
        first.getFullYear(),
        first.getMonth() + 1,
        first.getDate(),
        0, 0, 0, 0
      );
    }

    return count;
  }

  private _getDaysApart(a: Date, b: Date): number {
    let count: number = 0;
    let first: Date = a < b ? a : b;
    let last: Date = a < b ? b : a;

    while (first < last) {
      count++;
      first = new Date(
        first.getFullYear(),
        first.getMonth(),
        first.getDate() + 1,
        0, 0, 0, 0
      );
    }

    return count;
  }

  private _isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() == b.getFullYear() &&
      a.getMonth() == b.getMonth() &&
      a.getDate() == b.getDate();
  }
}
