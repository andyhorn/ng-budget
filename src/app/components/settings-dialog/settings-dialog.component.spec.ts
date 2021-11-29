import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppStateService } from 'src/app/services/state/app-state.service';

import { SettingsDialogComponent } from './settings-dialog.component';
import { FormsModule } from '@angular/forms';

describe('SettingsDialogComponent', () => {
  let component: SettingsDialogComponent;
  let fixture: ComponentFixture<SettingsDialogComponent>;
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save data to the state', () => {
    const startDate = new Date('January 1, 2020');
    const endDate = new Date('January 15, 2020');
    const startingAmount = 1000;
    const runningTotalThreshold = 100;
    const state = fixture.debugElement.injector.get(AppStateService);

    component.endDate = endDate;
    component.startDate = startDate;
    component.startingAmount = startingAmount;
    component.runningTotalThreshold = runningTotalThreshold;
    fixture.detectChanges();

    component.onSaveClick();

    expect(state.startDate).toEqual(startDate);
    expect(state.endDate).toEqual(endDate);
    expect(state.startingAmount).toEqual(startingAmount);
    expect(state.runningTotalThreshold).toEqual(runningTotalThreshold);
  });
});

describe('SettingsDialogComponent', () => {
  let component: SettingsDialogComponent;
  let fixture: ComponentFixture<SettingsDialogComponent>;
  const startDate: Date = new Date('January 1, 2020');
  const endDate: Date = new Date('January 15, 2020');
  const startingAmount: number = 1000;
  const runningTotalThreshold: number = 100;
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
        FormsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRef },
        { provide: AppStateService, useValue: {
          startDate,
          endDate,
          startingAmount,
          runningTotalThreshold,
        }},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should pull the state data', () => {
    expect(component.startDate).toEqual(startDate);
    expect(component.endDate).toEqual(endDate);
    expect(component.startingAmount).toEqual(startingAmount);
    expect(component.runningTotalThreshold).toEqual(runningTotalThreshold);
  });

  it('should set the date range inputs', async () => {
    const startDateString = toShortDateString(startDate);
    const endDateString = toShortDateString(endDate);
    const startDateInput = fixture.debugElement.query(By.css('input.mat-start-date'));
    const endDateInput = fixture.debugElement.query(By.css('input.mat-end-date'));

    expect(startDateInput.nativeElement.value).toBeFalsy();
    expect(endDateInput.nativeElement.value).toBeFalsy();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(startDateInput.nativeElement.value).toEqual(startDateString);
      expect(endDateInput.nativeElement.value).toEqual(endDateString);
    });
  })

  it('should set the starting amount', async () => {
    const startingAmountInput = fixture.debugElement.query(By.css('input.mat-input-element[type="number"]'));

    expect(startingAmountInput.nativeElement.value).toBeFalsy();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(startingAmountInput.nativeElement.value).toEqual(startingAmount.toString());
    })
  });

  it('should update the state with a new starting amount', async () => {
    const state = fixture.debugElement.injector.get(AppStateService);
    const input = fixture.nativeElement.querySelector('input#startingAmount');

    input.value = 123;
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    component.onSaveClick();
    await fixture.whenStable().then(() => {
      expect(state.startingAmount).toEqual(123);
    });
  });

  it('should update the state with a new threshold amount', async () => {
    const state = fixture.debugElement.injector.get(AppStateService);
    const thresholdInput = fixture.debugElement.query(By.css('input#threshold'));

    thresholdInput.nativeElement.value = 123;
    thresholdInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    component.onSaveClick();
    await fixture.whenStable().then(() => {
      expect(state.runningTotalThreshold).toEqual(123);
    });
  });

  it('should update the state with new dates', async () => {
    const startDateText = toShortDateString(startDate);
    const endDateText = toShortDateString(endDate);
    const state = fixture.debugElement.injector.get(AppStateService);
    const startDateInput = fixture.debugElement.query(By.css('input.mat-start-date'));
    const endDateInput = fixture.debugElement.query(By.css('input.mat-end-date'));

    startDateInput.nativeElement.value = startDateText;
    endDateInput.nativeElement.value = endDateText;
    startDateInput.nativeElement.dispatchEvent(new Event('input'));
    endDateInput.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    component.onSaveClick();

    await fixture.whenStable().then(() => {
      expect(state.startDate).toEqual(startDate);
      expect(state.endDate).toEqual(endDate);
    });
  });
});

function toShortDateString(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}
