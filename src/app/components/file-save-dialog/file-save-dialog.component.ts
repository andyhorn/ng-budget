import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-file-save-dialog',
  templateUrl: './file-save-dialog.component.html',
  styleUrls: ['./file-save-dialog.component.sass']
})
export class FileSaveDialogComponent {
  public filename: string = '';

  public get canSave(): boolean {
    return !!this.filename.trim();
  }

  constructor(
    public dialogReference: MatDialogRef<FileSaveDialogComponent>
  ) { }

  public onCancelClick(): void {
    this.dialogReference.close();
  }

  public onSaveClick(): void {
    this.dialogReference.close(this.filename);
  }
}
