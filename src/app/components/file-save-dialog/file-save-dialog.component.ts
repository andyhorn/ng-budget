import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-file-save-dialog',
  templateUrl: './file-save-dialog.component.html',
  styleUrls: ['./file-save-dialog.component.sass']
})
export class FileSaveDialogComponent implements OnInit {
  public filename: string = '';

  constructor(
    public dialogReference: MatDialogRef<FileSaveDialogComponent>
  ) { }

  ngOnInit(): void {
  }

  public onCancelClick(): void {
    this.dialogReference.close();
  }

  public onSaveClick(): void {
    this.dialogReference.close(this.filename);
  }
}
