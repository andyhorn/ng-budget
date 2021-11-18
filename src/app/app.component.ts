import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FileSaveDialogComponent } from './components/file-save-dialog/file-save-dialog.component';
import { SettingsDialogComponent } from './components/settings-dialog/settings-dialog.component';
import { SettingsDialogData } from './models/settings-dialog-data';
import { Transaction } from './models/transaction';
import { AppStateService } from './services/state/app-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
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

  public get canSave(): boolean {
    return this.state.transactions.length > 0;
  }

  constructor(
    public state: AppStateService,
    private _dialog: MatDialog
    ) {}

  public async onSaveClick(): Promise<void> {
    const filename: string = await this._getSavePath();

    if (!filename) {
      return;
    }

    const json: string = JSON.stringify(this.state.transactions);
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
          try {
            const transaction: Transaction = Transaction.fromJson(json);

            transactions.push(transaction);
          } catch (e) {
            console.error(e);
          }
        }

        this.state.setTransactions(transactions);
      }

      reader.readAsText(input.files[0]);
    }

    input.click();
  }

  public openSettingsDialog(): void {
    const originalData: SettingsDialogData = {
      startDate: this.firstDay,
      endDate: this.lastDay,
      startingAmount: this.startingAmount,
    };

    const dialog: MatDialogRef<SettingsDialogComponent> = this._dialog.open(SettingsDialogComponent, {
      data: originalData,
    });
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
