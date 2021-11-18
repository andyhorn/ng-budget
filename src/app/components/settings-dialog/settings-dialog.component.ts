import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AppStateService } from 'src/app/services/state/app-state.service';

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
    private _state: AppStateService
  ) { }

  ngOnInit(): void {
    this.startDate = this._state.startDate;
    this.endDate = this._state.endDate;
    this.startingAmount = this._state.startingAmount;
  }

  public onSaveClick(): void {
    this._state.startDate = this.startDate;
    this._state.endDate = this.endDate;
    this._state.startingAmount = this.startingAmount;

    this._dialogReference.close();
  }
}
