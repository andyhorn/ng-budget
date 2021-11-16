import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingsDialogData } from 'src/app/models/settings-dialog-data';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.sass']
})
export class SettingsDialogComponent implements OnInit {
  public startDate!: Date;
  public endDate!: Date;
  public startingAmount!: number;

  constructor(
    private _dialogReference: MatDialogRef<SettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: SettingsDialogData
  ) { }

  ngOnInit(): void {
    this.startDate = this._data.startDate;
    this.endDate = this._data.endDate;
    this.startingAmount = this._data.startingAmount;
  }

  public onSaveClick(): void {
    this._dialogReference.close(<SettingsDialogData>{
      startDate: this.startDate,
      endDate: this.endDate,
      startingAmount: this.startingAmount,
    });
  }
}
