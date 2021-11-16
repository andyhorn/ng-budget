import { Component, OnInit } from '@angular/core';
import { Transaction } from './models/transaction';
import { TransactionService } from './services/transaction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  private _transactions: Transaction[] = [];
  public startingAmount: number = 0;
  public today: Date = new Date();
  public firstDay: Date = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    1,
    0, 0, 0, 0);
  public lastDay: Date = new Date(
    this.today.getFullYear(),
    this.today.getMonth() + 1,
    0,
    0, 0, 0, 0);

  constructor(private _transactionService: TransactionService) {}

  ngOnInit(): void {
    this._transactionService.get().subscribe((transactions: Transaction[]) => this._transactions = transactions);
  }

  public onSaveClick(): void {
    const json: string = JSON.stringify(this._transactions);
    const anchor: HTMLAnchorElement = document.createElement('a');
    const blob: Blob = new Blob([json], {
      type: 'application/json',
    });

    anchor.download = 'budget_data.json';
    anchor.href = window.URL.createObjectURL(blob);

    anchor.click();
  }

  public onLoadClick(): void {
    const input: HTMLInputElement = document.createElement('input');
    input.setAttribute('type', 'file');

    input.oninput = () => {
      if (!input.files?.length) {
        return;
      }

      const reader: FileReader = new FileReader();

      reader.onload = (e) => {
        const contents: string = e.target?.result?.toString() ?? '';
        const data: any[] = JSON.parse(contents);
        const transactions: Transaction[] = [];

        for (const json of data) {
          const transaction: Transaction = Transaction.fromJson(json);

          transactions.push(transaction);
        }

        this._transactionService.load(transactions);
      }

      reader.readAsText(input.files[0]);
    }

    input.click();
  }
}
