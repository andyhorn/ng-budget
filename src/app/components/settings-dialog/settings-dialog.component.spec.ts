import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule, MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDateRangeInputHarness } from '@angular/material/datepicker/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppStateService } from 'src/app/services/state/app-state.service';

import { SettingsDialogComponent } from './settings-dialog.component';

describe('SettingsDialogComponent', () => {
  let component: SettingsDialogComponent;
  let fixture: ComponentFixture<SettingsDialogComponent>;
  let loader: HarnessLoader;
  // let rootLoader: HarnessLoader;
  let matDialogRef: any = {
    close: function () {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsDialogComponent ],
      imports: [
        MatDialogModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatNativeDateModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRef },
        AppStateService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDialogComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should save data to the state', () => {
    const startDate = new Date('January 1, 2020');
    const endDate = new Date('January 15, 2020');
    const startingAmount = 1000;
    const state = fixture.debugElement.injector.get(AppStateService);

    component.endDate = endDate;
    component.startDate = startDate;
    component.startingAmount = startingAmount;
    fixture.detectChanges();

    component.onSaveClick();

    expect(state.startDate).toEqual(startDate);
    expect(state.endDate).toEqual(endDate);
    expect(state.startingAmount).toEqual(startingAmount);
  });

  // it('should display the date range in a picker', async () => {
  //   const startDate = new Date('January 1, 2020');
  //   const endDate = new Date('January 15, 2020');
  //   const expectedStartText = `${startDate.getMonth()}/${startDate.getDate()}/${startDate.getFullYear()}`;
  //   const expectedEndText = `${endDate.getMonth()}/${endDate.getDate()}/${endDate.getFullYear()}`;

  //   component.startDate = startDate;
  //   component.endDate = endDate;
  //   const datePicker = await loader.getHarness(MatDateRangeInputHarness);
  //   fixture.detectChanges();
  //   fixture.whenStable().then(async () => {
  //     const content = await datePicker.getValue();
  //   });


    // const startDateInput = fixture.nativeElement.querySelector('input.mat-start-date');
    // const endDateInput = fixture.nativeElement.querySelector('input.mat-end-date');

    // const startDateValue = startDateInput.getValue();
    // const endDateValue = endDateInput.value();

    // expect(startDateInput.nativeElement.value).toEqual(expectedStartText);
    // expect(endDateInput.nativeElement.value).toEqual(expectedEndText);
  // });
});

describe('SettingsDialogComponent', () => {
  let component: SettingsDialogComponent;
  let fixture: ComponentFixture<SettingsDialogComponent>;
  let loader: HarnessLoader;
  const startDate: Date = new Date('January 1, 2020');
  const endDate: Date = new Date('January 15, 2020');
  const startingAmount: number = 1000;
  // let rootLoader: HarnessLoader;
  let matDialogRef: any = {
    close: function () {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsDialogComponent ],
      imports: [
        MatDialogModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatNativeDateModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRef },
        { provide: AppStateService, useValue: {
          startDate,
          endDate,
          startingAmount,
        }},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDialogComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should pull the state data', () => {
    expect(component.startDate).toEqual(startDate);
    expect(component.endDate).toEqual(endDate);
    expect(component.startingAmount).toEqual(startingAmount);
  });
})
