import { Frequency } from '../models/recurrence';
import { Transaction } from '../models/transaction';
import { OccurrenceFinder } from './occurrence-finder';

describe('OccurrenceFinder', () => {
  let transactions: Transaction[];
  let startDate: Date;
  let endDate: Date;

  beforeEach(() => {
    transactions = [];
    startDate = new Date('January 1, 2020');
    endDate = new Date('January 31, 2020');
  });

  it('should create an instance', () => {
    expect(new OccurrenceFinder()).toBeTruthy();
  });

  it('should find an every-day occurrence for each date in the range', () => {
    setTransaction('Every day', Frequency.Daily, 1);
    const occurrences = OccurrenceFinder.findOccurrences(transactions, startDate, endDate);
    expect(occurrences.length).toEqual(31);
    expect(occurrences.every(o => o.transactions.length === 1));
  });

  it('should find the correct number of every-other-day occurrences in the date range', () => {
    setTransaction('Every other day', Frequency.Daily, 2);
    const occurrences = OccurrenceFinder.findOccurrences(transactions, startDate, endDate);
    expect(occurrences.length).toEqual(16);
    expect(occurrences.every(o => o.transactions.length === 1));
  });

  it('should find the correct number of weekly occurrences in the date range', () => {
    setTransaction('Every week', Frequency.Weekly, 1);
    const expectedNumOccurrences = 5;
    const occurrences = OccurrenceFinder.findOccurrences(transactions, startDate, endDate);
    expect(occurrences.length).toEqual(expectedNumOccurrences);
  });

  it('should find the correct number of bi-weekly occurrences in the date range', () => {
    setTransaction('Every other week', Frequency.Weekly, 2);
    const expectedNumOccurrences = 3;
    const occurrences = OccurrenceFinder.findOccurrences(transactions, startDate, endDate);
    expect(occurrences.length).toEqual(expectedNumOccurrences);
  });

  it('should find the correct number of monthly occurrences in the date range', () => {
    setTransaction('Every month', Frequency.Monthly, 1);
    endDate = new Date('March 1, 2020');
    const expectedNumOccurrences = 3;
    const occurrences = OccurrenceFinder.findOccurrences(transactions, startDate, endDate);
    expect(occurrences.length).toEqual(expectedNumOccurrences);
  });

  it('should find the correct number of bi-monthly occurrences in the date range', () => {
    setTransaction('Every other month', Frequency.Monthly, 2);
    endDate = new Date('December 1, 2020');
    const expectedNumOccurrences = 6;
    const occurrences = OccurrenceFinder.findOccurrences(transactions, startDate, endDate);
    expect(occurrences.length).toEqual(expectedNumOccurrences);
  });

  it('should combine transactions on the same day into one occurrence', () => {
    setTransaction('Every day', Frequency.Daily, 1);
    setTransaction('Also every day', Frequency.Daily, 1);
    const expectedNumOccurrences = 31;
    const occurrences = OccurrenceFinder.findOccurrences(transactions, startDate, endDate);
    expect(occurrences.length).toEqual(expectedNumOccurrences);
    expect(occurrences.every(o => o.transactions.length === 2)).toBeTrue();
  });

  function setTransaction(title: string, frequency: Frequency, interval: number, startDate: Date | null = null): void {
    transactions.push(new Transaction(title));

    transactions[transactions.length - 1].recurrence.frequency = frequency;
    transactions[transactions.length - 1].recurrence.interval = interval;
    transactions[transactions.length - 1].recurrence.startDate = startDate ?? new Date('January 1, 2020');
  }
});
