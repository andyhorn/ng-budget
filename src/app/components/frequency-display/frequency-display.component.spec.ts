import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Frequency } from 'src/app/models/recurrence';

import { FrequencyDisplayComponent } from './frequency-display.component';

describe('FrequencyDisplayComponent', () => {
  let component: FrequencyDisplayComponent;
  let fixture: ComponentFixture<FrequencyDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrequencyDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequencyDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return once for Frequency.Once', () => {
    component.frequency = Frequency.Once;
    fixture.detectChanges();

    expect(component.display).toEqual('once');
  });

  it('should should return daily for Frequency.Daily with interval of one', () => {
    component.frequency = Frequency.Daily;
    component.interval = 1;
    fixture.detectChanges();

    expect(component.display).toContain('daily');
  });

  it('should return days for Frequency.Daily with an interval greater than one', () => {
    component.frequency = Frequency.Daily;
    component.interval = 2;
    fixture.detectChanges();

    expect(component.display).toContain('days');
  });

  it('should return weekly for Frequency.Weekly with an interval of one', () => {
    component.frequency = Frequency.Weekly;
    component.interval = 1;
    component.date = new Date();
    fixture.detectChanges();

    expect(component.display).toContain('weekly');
  });

  it('should return weeks for Frequency.Weekly with an interval greater than one', () => {
    component.frequency = Frequency.Weekly;
    component.interval = 2;
    component.date = new Date();
    fixture.detectChanges();

    expect(component.display).toContain('weeks');
  });

  it('should return the day of the week for Frequency.Weekly', () => {
    component.frequency = Frequency.Weekly;
    component.interval = 1;
    const date = component.date = new Date();

    expect(component.display).toContain(getWeekday(date.getDay()));
  });

  it('should return monthly for Frequency.Monthly with an interval of one', () => {
    component.frequency = Frequency.Monthly;
    component.interval = 1;
    component.date = new Date();

    expect(component.display).toContain('monthly');
  });

  it('should return months for Frequency.Monthly with an interval greater than one', () => {
    component.frequency = Frequency.Monthly;
    component.interval = 2;
    component.date = new Date();

    expect(component.display).toContain('months');
  });

  it('should contain the date for Frequency.Monthly', () => {
    component.frequency = Frequency.Monthly;
    component.interval = 1;
    const date = component.date = new Date();

    expect(component.display).toContain(date.getDate().toString());
  });

  it('should contain yearly for Frequency.Yearly with an interval of one', () => {
    component.frequency = Frequency.Yearly;
    component.interval = 1;
    component.date = new Date();

    expect(component.display).toContain('yearly');
  });

  it('should contain years for Frequency.Yearly with an interval greater than one', () => {
    component.frequency = Frequency.Yearly;
    component.interval = 2;
    component.date = new Date();

    expect(component.display).toContain('years');
  });

  it('should contain the month for Frequency.Yearly', () => {
    component.frequency = Frequency.Yearly;
    component.interval = 1;
    const date = component.date = new Date();

    expect(component.display).toContain(getMonth(date.getMonth()));
  });

  it('should contain the interval for all frequencies, except Once, with an interval greater than one', () => {
    const interval = component.interval = 2;
    const frequencies = [];
    for (let f in Frequency) {
      if (!isNaN(Number(f))) {
        frequencies.push(Number(f));
      }
    }

    component.date = new Date();

    for (let frequency of frequencies) {
      if (frequency == Frequency.Once) {
        continue;
      }

      component.frequency = frequency;
      fixture.detectChanges();

      expect(component.display).toContain(interval.toString());
    }
  });
});

function getWeekday(day: number): string {
  switch (day) {
    case 0: return 'Sunday';
    case 1: return 'Monday';
    case 2: return 'Tuesday';
    case 3: return 'Wednesday';
    case 4: return 'Thursday';
    case 5: return 'Friday';
    case 6: return 'Saturday';
    default: return '';
  };
}

function getMonth(month: number): string {
  switch (month) {
    case 0: return 'January';
    case 1: return 'February';
    case 2: return 'March';
    case 3: return 'April';
    case 4: return 'May';
    case 5: return 'June';
    case 6: return 'July';
    case 7: return 'August';
    case 8: return 'September';
    case 9: return 'October';
    case 10: return 'November';
    case 11: return 'December';
    default: return '';
  }
}
