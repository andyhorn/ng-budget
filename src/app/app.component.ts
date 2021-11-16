import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FileSaveDialogComponent } from './components/file-save-dialog/file-save-dialog.component';
import { Transaction } from './models/transaction';
import { TransactionService } from './services/transaction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  public transactions: Transaction[] = [];
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

  constructor(
    private _transactionService: TransactionService,
    private _dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this._transactionService.get().subscribe((transactions: Transaction[]) => this.transactions = transactions);
  }

  public async onSaveClick(): Promise<void> {
    const filename: string = await this._getSavePath();

    if (!filename) {
      return;
    }

    const json: string = JSON.stringify(this.transactions);
    const anchor: HTMLAnchorElement = document.createElement('a');
    const blob: Blob = new Blob([json], {
      type: 'application/json',
    });

    anchor.download = `${filename}.json`;
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

  private async _getSavePath(): Promise<string> {
    return new Promise<string>((resolve) => {
      const dialog: MatDialogRef<FileSaveDialogComponent> = this._dialog.open(FileSaveDialogComponent);
      dialog.afterClosed().subscribe((path) => {
        resolve(path);
      });
    });
  }
}
