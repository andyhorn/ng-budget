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
  public runningTotalThreshold!: number;

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>,
    private state: AppStateService
  ) { }

  ngOnInit(): void {
    this.startDate = this.state.startDate;
    this.endDate = this.state.endDate;
    this.startingAmount = this.state.startingAmount;
    this.runningTotalThreshold = this.state.runningTotalThreshold;
  }

  public onSaveClick(): void {
    this.state.startDate = this.startDate;
    this.state.endDate = this.endDate;
    this.state.startingAmount = this.startingAmount;
    this.state.runningTotalThreshold = this.runningTotalThreshold;

    this.dialogRef.close();
  }
}
