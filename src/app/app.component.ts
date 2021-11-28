import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileSaveDialogComponent } from './components/file-save-dialog/file-save-dialog.component';
import { SettingsDialogComponent } from './components/settings-dialog/settings-dialog.component';
import { JsonParseError } from './models/json-parse-error';
import { Transaction } from './models/transaction';
import { PersistenceService } from './services/persistence.service';
import { AppStateService } from './services/state/app-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  public get canSave(): boolean {
    return this.state.transactions.length > 0;
  }

  constructor(
    public state: AppStateService,
    private dialog: MatDialog,
    private persistenceService: PersistenceService,
    private snackbar: MatSnackBar
    ) {}

  public async onSaveClick(): Promise<void> {
    const filename: string = await this.getSavePath();

    if (!filename) {
      return;
    }

    const json: string = this.persistenceService.getJson();
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

        try {
          const transactions: Transaction[] = this.persistenceService.readJson(contents);

          this.state.clearTransactions();
          this.state.addTransactions(transactions);
        } catch (e) {
          if (!(e instanceof JsonParseError)) {
            throw e;
          }

          this.snackbar.open('Error loading file', 'Okay', {
            duration: 3000,
            panelClass: "bg-danger",
          });

          console.error(e.message);
          console.error(e.data);
        }
      }

      reader.readAsText(input.files[0]);
    }

    input.click();
  }

  public openSettingsDialog(): void {
    this.dialog.open(SettingsDialogComponent);
  }

  private async getSavePath(): Promise<string> {
    return new Promise<string>((resolve) => {
      const dialog: MatDialogRef<FileSaveDialogComponent> = this.dialog.open(FileSaveDialogComponent);
      dialog.afterClosed().subscribe((path) => {
        resolve(path);
      });
    });
  }
}
