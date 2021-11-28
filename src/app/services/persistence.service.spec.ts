import { TestBed } from '@angular/core/testing';
import { JsonParseError } from '../models/json-parse-error';
import { Frequency } from '../models/recurrence';
import { Transaction, TransactionTypes } from '../models/transaction';

import { PersistenceService } from './persistence.service';
import { AppStateService } from './state/app-state.service';

const amount = 100;
const id = 1;
const type = TransactionTypes.Expense;
const title = 'test';
const frequency = Frequency.Daily;
const interval = 3;
const startDate = new Date('January 1, 2020');
const skip: Date[] = [new Date('January 15, 2020')];
startDate.setHours(0, 0, 0, 0);

describe('PersistenceService', () => {
  let service: PersistenceService;
  let state: AppStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersistenceService);
    state = TestBed.inject(AppStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert a transaction into a json object', () => {
    const transaction = new Transaction();
    spyOnProperty(state, 'transactions').and.returnValue([transaction]);
    const json = service.getJson();

    expect(json).toBeTruthy();
    expect(json.length).toBeGreaterThan(0);
  });

  it('should convert multiple transactions into a json object', () => {
    const transactions = [
      new Transaction(),
      new Transaction(),
      new Transaction(),
    ];
    spyOnProperty(state, 'transactions').and.returnValue(transactions);
    const json = service.getJson();
    const parsed = JSON.parse(json);

    expect(parsed.length).toEqual(transactions.length);
  });

  it('should include all of the transaction data in the json string', () => {
    const amount = 100;
    const id = 1;
    const title = 'test';
    const frequency = Frequency.Daily;
    const interval = 3;
    const type = TransactionTypes.Expense;
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const transaction = new Transaction(title, amount, type);
    transaction.id = id;
    transaction.recurrence.frequency = frequency;
    transaction.recurrence.interval = interval;
    transaction.recurrence.startDate = startDate;

    spyOnProperty(state, 'transactions').and.returnValue([transaction]);
    const json = JSON.parse(service.getJson())[0];

    expect(json.amount).toEqual(amount);
    expect(json.id).toEqual(id);
    expect(json.title).toEqual(title);
    expect(json.type).toEqual(type);
    expect(json.recurrence).toBeTruthy();
    expect(json.recurrence.frequency).toEqual(frequency);
    expect(json.recurrence.interval).toEqual(interval);
    expect(json.recurrence.startDate).toEqual(startDate.toISOString());
  });

  it('should parse a json string into a transaction', () => {
    const json = `[${buildTransactionJson(id, title, amount, type, skip, frequency, interval, startDate)}]`;
    const parsed = service.readJson(json);

    expect(parsed.length).toEqual(1);
  });

  it('should parse all the transaction data from the json string', () => {
    const json = `[${buildTransactionJson(id, title, amount, type, skip, frequency, interval, startDate)}]`;
    const parsed = service.readJson(json);

    expect(parsed[0].amount).toEqual(amount);
    expect(parsed[0].id).toEqual(id);
    expect(parsed[0].title).toEqual(title);
    expect(parsed[0].type).toEqual(type);
    expect(parsed[0].recurrence.frequency).toEqual(frequency);
    expect(parsed[0].recurrence.interval).toEqual(interval);
    expect(parsed[0].recurrence.startDate).toEqual(startDate);
  });

  it('should throw an error for any missing values', async () => {
    const properties = [
      'id',
      'amount',
      'title',
      'type'
    ];
    const recurrenceProperties = [
      'frequency',
      'interval',
      'startDate',
    ];

    const jsonString = buildTransactionJson(id, title, amount, type, skip, frequency, interval, startDate);

    for (let prop of properties) {
      const badObj = JSON.parse(jsonString);
      badObj[prop] = undefined;
      const badString = JSON.stringify(badObj);

      expect(() => service.readJson(`[${badString}]`)).toThrowError(JsonParseError);
    }

    for (let prop of recurrenceProperties) {
      const badObj = JSON.parse(jsonString);
      badObj.recurrence[prop] = undefined;
      const badString = JSON.stringify(badObj);

      expect(() => service.readJson(`[${badString}]`)).toThrowError(JsonParseError);
    }
  });
});


function buildTransactionJson(id: number, title: string, amount: number, type: TransactionTypes, skip: Date[], frequency: Frequency, interval: number, startDate: Date): string {
  const skipStrings: string = skip.map(d => d.toISOString()).map(s => `"${s}"`).join(',');
  const json: string = `{"id":${id},"title":"${title}","amount":${amount},"type":${type},"skip":[${skipStrings}],"recurrence":{"frequency":${frequency},"interval":${interval},"startDate":"${startDate.toISOString()}"}}`;
  return json;
}
