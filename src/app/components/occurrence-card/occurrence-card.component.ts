import { Component, Input } from '@angular/core';
import { Occurrence } from 'src/app/models/occurrence';
import { Transaction, TransactionTypes } from 'src/app/models/transaction';
import { AppStateService } from 'src/app/services/state/app-state.service';

@Component({
  selector: 'app-occurrence-card',
  templateUrl: './occurrence-card.component.html',
  styleUrls: ['./occurrence-card.component.sass']
})
export class OccurrenceCardComponent {
  @Input() occurrence!: Occurrence;
  @Input() occurrenceIndex!: number;

  public getHighlightClass(transaction: Transaction): string {
    return transaction.type == TransactionTypes.Expense ? 'text-danger' : 'text-success';
  }

  public getRunningTotal(oi: number, ti: number): number {
    return this.state.runningTotal.getTotal(oi, ti);
  }

  public getRunningTotalClass(occurrenceIndex: number, transactionIndex: number): string {
    const runningTotal: number = this.state.runningTotal.getTotal(occurrenceIndex, transactionIndex);

    return runningTotal < this.state.runningTotalThreshold
      ? 'text-danger text-bold' : 'text-success';
  }

  constructor(
    public state: AppStateService
  ) { }
}
