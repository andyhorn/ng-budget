import { Injectable } from '@angular/core';
import { ErrorType, JsonParseError } from '../models/json-parse-error';
import { Transaction, TransactionTypes } from '../models/transaction';
import { AppStateService } from './state/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  constructor(
    private state: AppStateService
  ) { }

  public getJson(): string {
    const transactionJson: string[] = [];

    for (const transaction of this.state.transactions) {
      const json: any = this.makeJson(transaction);
      transactionJson.push(json);
    }

    return JSON.stringify(transactionJson);
  }

  public readJson(jsonString: string): Transaction[] {
    const transactions: Transaction[] = [];
    const json: any = JSON.parse(jsonString);

    for (const jsonObject of json) {
      const transaction: Transaction = this.parseJson(jsonObject);
      transactions.push(transaction);
    }

    return transactions;
  }

  private parseJson(json: any): Transaction {
    const title: string = this.extractValue<string>(json, 'title');
    const amount: number = this.extractValue<number>(json, 'amount');
    const id: number = this.extractValue<number>(json, 'id');
    const type: TransactionTypes = this.extractValue<number>(json, 'type');
    const interval: number = this.extractValue<number>(json, 'recurrence', 'interval');
    const frequency: number = this.extractValue<number>(json, 'recurrence', 'frequency');
    const startDate: Date = new Date(this.extractValue<string>(json, 'recurrence', 'startDate'));

    this.validateValues('string', title, 'title');
    this.validateValues('number', amount, 'amount');
    this.validateValues('number', id, 'id');
    this.validateValues('number', type, 'type');
    this.validateValues('number', interval, 'recurrence.interval');
    this.validateValues('number', frequency, 'recurrence.frequency');
    this.validateValues('object', startDate, 'recurrence.startDate');

    const transaction: Transaction = new Transaction(title, amount, type);
    transaction.id = id;
    transaction.recurrence.frequency = frequency;
    transaction.recurrence.interval = interval;
    transaction.recurrence.startDate = startDate;

    return transaction;
  }

  private makeJson(transaction: Transaction): any {
    const json: any = {
      id: transaction.id,
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      recurrence: {
        interval: transaction.recurrence.interval,
        frequency: transaction.recurrence.frequency,
        startDate: transaction.recurrence.startDate,
      },
    };

    return json;
  }

  private extractValue<T>(json: any, ...args: string[]): T {
    let data: any = json;
    let path: string = args[0];

    for (let i = 0; i < args.length; i++) {
      path = args[i];

      if (!(path in data)) {
        throw new JsonParseError(path, ErrorType.Missing, json);
      }

      data = data[args[i]];
    }

    return <T>data;
  }

  private validateValues(type: string, value: any, property: string): void {
    const valueType: string = typeof(value);
    if (valueType != type) {
      throw new JsonParseError(property, ErrorType.Invalid, value);
    }
  }
}
