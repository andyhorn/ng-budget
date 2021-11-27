import { Occurrence } from "./occurrence";
import { TransactionTypes } from "./transaction";

export class RunningTotal {
  private occurrenceTransactionTotals: number[][] = [];
  private startingAmount: number = 0;

  constructor(occurrences: Occurrence[], startingAmount: number = 0) {
    let runningTotal: number = this.startingAmount = startingAmount;

    for (let oc: number = 0; oc < occurrences.length; oc++) {
      this.occurrenceTransactionTotals.push([]);

      for (let tr: number = 0; tr < occurrences[oc].transactions.length; tr++) {
        const isExpense: boolean = occurrences[oc].transactions[tr].type == TransactionTypes.Expense;
        const amount: number = occurrences[oc].transactions[tr].amount;

        runningTotal = isExpense ? runningTotal - amount : runningTotal + amount;
        this.occurrenceTransactionTotals[oc].push(runningTotal);
      }
    }
  }

  public getTotal(occurrence: number, transaction: number): number {
    if (occurrence < 0) {
      throw 'Invalid argument: occurrence. Must be greater than or equal to zero';
    }

    if (transaction < 0) {
      throw 'Invalid argument: transaction. Must be greater than or equal to zero';
    }

    if (this.occurrenceTransactionTotals.length === 0) {
      return this.startingAmount;
    }

    if (occurrence >= this.occurrenceTransactionTotals.length) {
      return 0;
    }

    if (transaction >= this.occurrenceTransactionTotals[occurrence].length) {
      return 0;
    }

    return this.occurrenceTransactionTotals[occurrence][transaction];
  }
}
