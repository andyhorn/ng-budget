import { Occurrence } from "./occurrence";

export class RunningTotal {
  private occurrenceTransactionTotals: number[][] = [];

  constructor(occurrences: Occurrence[], startingAmount: number = 0) {
    let runningTotal: number = startingAmount;

    for (let oc: number = 0; oc < occurrences.length; oc++) {
      this.occurrenceTransactionTotals.push([]);

      for (let tr: number = 0; tr < occurrences[oc].transactions.length; tr++) {
        const isExpense: boolean = occurrences[oc].transactions[tr].isExpense;
        const amount: number = occurrences[oc].transactions[tr].amount;

        runningTotal = isExpense ? runningTotal - amount : runningTotal + amount;
        this.occurrenceTransactionTotals[oc].push(runningTotal);
      }
    }
  }

  public getTotal(occurrence: number, transaction: number): number {
    if (occurrence >= this.occurrenceTransactionTotals.length) {
      return 0;
    }

    if (transaction >= this.occurrenceTransactionTotals[occurrence].length) {
      return 0;
    }

    return this.occurrenceTransactionTotals[occurrence][transaction];
  }
}
