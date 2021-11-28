import { Frequency } from "./recurrence";
import { Transaction, TransactionTypes } from "./transaction";

describe('Transaction', () => {
  const amount = 100;
  const id = 3;
  const type = TransactionTypes.Expense;
  const title = 'Test transaction';
  const frequency = Frequency.Daily;
  const interval = 1;
  const startDate = 'January 1, 2020';

  it('should create an instance', () => {
    expect(new Transaction()).toBeTruthy();
  });

  it('should return true for a single occurrence on the correct date', () => {
    const targetDate = new Date('January 1, 2020');
    const transaction = new Transaction('Test');
    transaction.recurrence.startDate = targetDate;
    transaction.recurrence.interval = 1;
    transaction.recurrence.frequency = Frequency.Once;

    expect(transaction.occursOn(new Date('January 1, 2020'))).toBeTrue();
  });

  it('should return true for a daily occurrence on the correct interval', () => {
    const startDate = new Date('January 1, 2020');
    const interval = 3;
    const transaction = new Transaction();
    transaction.recurrence.startDate = startDate;
    transaction.recurrence.frequency = Frequency.Daily;
    transaction.recurrence.interval = interval;

    let testDate = new Date('January 1, 2020');
    let passed = true;
    for (let i = 0; i < 1000 && passed; i++) {
      let occursOn = transaction.occursOn(testDate);

      if (!occursOn) {
        transaction.occursOn(testDate);
        passed = false;
        break;
      }

      addDays(testDate, interval);
    }

    expect(passed).toBeTrue();
  });

  it('should return false for a daily occurrence on an incorrect interval', () => {
    const interval = 3;
    const transaction = new Transaction();
    transaction.recurrence.startDate = new Date('January 1, 2020');
    transaction.recurrence.frequency = Frequency.Daily;
    transaction.recurrence.interval = interval;

    let testDate = new Date('January 2, 2020');
    let testDate2 = new Date('January 3, 2020');
    let passed = true;
    for (let i = 0; i < 1000; i++) {
      let occursOn = transaction.occursOn(testDate);
      let occursOn2 = transaction.occursOn(testDate2);

      if (occursOn || occursOn2) {
        passed = false;
        break;
      }

      addDays(testDate, interval);
      addDays(testDate2, interval);
    }

    expect(passed).toBeTrue();
  });

  it('should return true for a weekly occurrence on the correct interval', () => {
    const interval = 3;
    const transaction = new Transaction();
    transaction.recurrence.interval = interval;
    transaction.recurrence.frequency = Frequency.Weekly;
    transaction.recurrence.startDate = new Date('January 1, 2020');

    let testDate = new Date('January 1, 2020');
    let passed = true;

    for (let i = 0; i < 1000; i++) {
      passed = transaction.occursOn(testDate);

      if (!passed) {
        break;
      }

      addWeeks(testDate, interval);
    }

    expect(passed).toBeTrue();
  });

  it('should return false for a weekly occurrence on the wrong interval', () => {
    const interval = 3;
    const transaction = new Transaction();
    const startDate = new Date('January 1, 2020');
    transaction.recurrence.interval = interval;
    transaction.recurrence.frequency = Frequency.Weekly;
    transaction.recurrence.startDate = startDate;

    let oneWeek = new Date('January 8, 2020');
    let twoWeeks = new Date('January 15, 2020');
    let threeWeeks = new Date('January 22, 2020');

    let passed = true;
    for (let i = 0; i < 100; i++) {
      passed = transaction.occursOn(oneWeek) === false &&
        transaction.occursOn(twoWeeks) === false &&
        transaction.occursOn(threeWeeks) === true;

      if (!passed) {
        break;
      }

      addWeeks(oneWeek, interval);
      addWeeks(twoWeeks, interval);
      addWeeks(threeWeeks, interval);
    }

    expect(passed).toBeTrue();
  });

  it('should return true for monthly occurrences on the correct date and interval', () => {
    const interval = 3;
    const transaction = new Transaction();
    const startDate = new Date('January 1, 2020');
    transaction.recurrence.interval = interval;
    transaction.recurrence.frequency = Frequency.Monthly;
    transaction.recurrence.startDate = startDate;

    let threeMonths = new Date('April 1, 2020');
    let passed = true;

    for (let i = 0; i < 100; i++) {
      passed = transaction.occursOn(threeMonths);

      if (!passed) {
        break;
      }

      addMonths(threeMonths, interval);
    }

    expect(passed).toBeTrue();
  });

  it('should return false for monthly occurrences on the wrong interval', () => {
    const interval = 3;
    const transaction = new Transaction();
    const startDate = new Date('January 1, 2020');
    transaction.recurrence.interval = interval;
    transaction.recurrence.frequency = Frequency.Monthly;
    transaction.recurrence.startDate = startDate;

    let oneMonth = new Date('February 1, 2020');
    let twoMonths = new Date('March 1, 2020');
    let passed = true;

    for (let i = 0; i < 100; i++) {
      passed = transaction.occursOn(oneMonth) === false &&
        transaction.occursOn(twoMonths) === false;

      if (!passed) {
        break;
      }

      addMonths(oneMonth, interval);
      addMonths(twoMonths, interval);
    }

    expect(passed).toBeTrue();
  });

  it('should return true for yearly occurrences on the correct date and interval', () => {
    const interval = 3;
    const transaction = new Transaction();
    const startDate = new Date('January 1, 2020');
    transaction.recurrence.interval = interval;
    transaction.recurrence.frequency = Frequency.Yearly;
    transaction.recurrence.startDate = startDate;

    let threeYears = new Date('January 1, 2023');
    let passed = true;

    for (let i = 0; i < 100; i++) {
      passed = transaction.occursOn(threeYears);

      if (!passed) {
        break;
      }

      addYears(threeYears, interval);
    }

    expect(passed).toBeTrue();
  });

  it('should return false for yearly occurrences on the wrong interval', () => {
    const interval = 3;
    const transaction = new Transaction();
    const startDate = new Date('January 1, 2020');
    transaction.recurrence.interval = interval;
    transaction.recurrence.frequency = Frequency.Yearly;
    transaction.recurrence.startDate = startDate;

    let oneYear = new Date('January 1, 2021');
    let twoYears = new Date('January 1, 2022');
    let passed = true;

    for (let i = 0; i < 100; i++) {
      passed = transaction.occursOn(oneYear) === false &&
        transaction.occursOn(twoYears) === false;

      if (!passed) {
        break;
      }

      addYears(oneYear, interval);
      addYears(twoYears, interval);
    }

    expect(passed).toBeTrue();
  });
});

function addYears(date: Date, numYears: number): void {
  date.setFullYear(date.getFullYear() + numYears);
}

function addMonths(date: Date, numMonths: number): void {
  date.setMonth(date.getMonth() + numMonths);
}

function addWeeks(date: Date, numWeeks: number): void {
  addDays(date, numWeeks * 7);
}

function addDays(date: Date, numDays: number): void {
  date.setDate(date.getDate() + numDays);
}
