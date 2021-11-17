import { Occurrence } from "../models/occurernce";
import { Transaction } from "../models/transaction";

export class OccurrenceFinder {
  public static findOccurrences(transactions: Transaction[], startDate: Date, endDate: Date) {
    const occurrences: Occurrence[] = [];
    let currentDate: Date = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= endDate) {
      const dateTransactions: Transaction[] =
        transactions.filter((t: Transaction) => t.occursOn(currentDate));

      if (dateTransactions.length > 0) {
        const occurrence: Occurrence = new Occurrence(new Date(currentDate), dateTransactions);
        occurrences.push(occurrence);
      }

      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1,
        0, 0, 0, 0
      );
    }

    return occurrences;
  }
}
