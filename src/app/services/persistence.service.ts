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
    if (typeof json === 'string') {
      json = JSON.parse(json);
    }

    const title: string = this.extractAndValidateValue(json, 'string', 'title');
    const amount: number = this.extractAndValidateValue(json, 'number', 'amount');
    const id: number = this.extractAndValidateValue(json, 'number', 'id');
    const type: TransactionTypes = this.extractAndValidateValue(json, 'number', 'type');
    const interval: number = this.extractAndValidateValue(json, 'number', 'recurrence', 'interval');
    const frequency: number = this.extractAndValidateValue(json, 'number', 'recurrence', 'frequency');
    const startDate: Date = new Date(this.extractAndValidateValue(json, 'string', 'recurrence', 'startDate'));

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

  private extractAndValidateValue(json: any, type: string, ...args: string[]): any {
    let data: any = json;
    let path: string = args[0];

    for (let i = 0; i < args.length; i++) {
      path = args[i];

      if (!(path in data)) {
        throw new JsonParseError(path, type, ErrorType.Missing, json);
      }

      data = data[args[i]];
    }

    if (typeof data !== type) {
      throw new JsonParseError(path, type, ErrorType.Invalid, json);
    }

    return data;
  }
}
