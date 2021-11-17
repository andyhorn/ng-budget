import { Occurrence } from "./occurernce";

export class RunningTotal {
  private _occurrenceTransactionTotals: number[][] = [];

  constructor(occurrences: Occurrence[], startingAmount: number = 0) {
    let runningTotal: number = startingAmount;

    for (let oc: number = 0; oc < occurrences.length; oc++) {
      this._occurrenceTransactionTotals.push([]);

      for (let tr: number = 0; tr < occurrences[oc].transactions.length; tr++) {
        const isExpense: boolean = occurrences[oc].transactions[tr].isExpense;
        const amount: number = occurrences[oc].transactions[tr].amount;

        runningTotal = isExpense ? runningTotal - amount : runningTotal + amount;
        this._occurrenceTransactionTotals[oc].push(runningTotal);
      }
    }
  }

  public getNumOccurrences(): number {
    return this._occurrenceTransactionTotals.length;
  }

  public getNumTransactions(occurrence: number): number {
    if (occurrence >= this._occurrenceTransactionTotals.length) {
      return 0;
    }

    return this._occurrenceTransactionTotals[occurrence].length;
  }

  public getTotal(occurrence: number, transaction: number): number {
    if (occurrence >= this._occurrenceTransactionTotals.length) {
      return 0;
    }

    if (transaction >= this._occurrenceTransactionTotals[occurrence].length) {
      return 0;
    }

    return this._occurrenceTransactionTotals[occurrence][transaction];
  }
}
