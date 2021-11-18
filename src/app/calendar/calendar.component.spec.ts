import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Occurrence } from '../models/occurrence';
import { AppStateService } from '../services/state/app-state.service';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct start date', () => {
    const startDate: Date = new Date('2021-01-01');
    const state = fixture.debugElement.injector.get(AppStateService);
    state.startDate = startDate;

    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('.date-range'));
    const text = header.nativeElement.innerText;
    const firstDate = new Date(text.split('through')[0].trim());
    expect(firstDate).toEqual(startDate);
  });

  it('should display the correct end date', () => {
    const endDate: Date = new Date('January 1, 2020');
    const state = fixture.debugElement.injector.get(AppStateService);
    state.endDate = endDate;

    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('.date-range'));
    const text = header.nativeElement.innerText;
    const lastDate = new Date(text.split('through')[1].trim());
    expect(lastDate).toEqual(endDate);
  });

  it('should not display the finance card if no occurrences are present', () => {
    const card = fixture.debugElement.query(By.css('.finance-details-card'));
    expect(card).toBeNull();
  })

  it('should display a no data message if no occurrences are present', () => {
    expect(fixture.debugElement.query(By.css('.no-data'))).toBeTruthy();
  });

  it('should display a finance details card when occurrences are present', () => {
    const occurrences = [
      new Occurrence(new Date('January 1, 2020'), []),
    ];
    const state = fixture.debugElement.injector.get(AppStateService);
    spyOnProperty(state, 'occurrences').and.returnValue(occurrences);

    fixture.detectChanges();

    const financeCard = fixture.debugElement.query(By.css('.finance-details-card'));
    expect(financeCard).toBeTruthy();
  });

  it('should display a card for each occurrence', () => {
    const occurrences = [
      new Occurrence(new Date('January 1, 2020'), []),
      new Occurrence(new Date('January 2, 2020'), [])
    ];
    const state = fixture.debugElement.injector.get(AppStateService);
    spyOnProperty(state, 'occurrences').and.returnValue(occurrences);

    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('.occurrence-card'));
    expect(cards.length).toEqual(occurrences.length);
  });

  it('should pull the start date from the state', () => {
    const startDate = new Date('January 1, 2020');
    const state = fixture.debugElement.injector.get(AppStateService);
    spyOnProperty(state, 'startDate').and.returnValue(startDate);

    fixture.detectChanges();

    expect(component.firstDay).toEqual(startDate);
  });

  it('should pull the end date from the state', () => {
    const endDate = new Date('January 1, 2020');
    const state = fixture.debugElement.injector.get(AppStateService);
    spyOnProperty(state, 'endDate').and.returnValue(endDate);

    fixture.detectChanges();

    expect(component.lastDay).toEqual(endDate);
  });
});
