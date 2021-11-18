import { Component } from '@angular/core';
import { Occurrence } from '../models/occurrence';
import { AppStateService } from '../services/state/app-state.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.sass']
})
export class CalendarComponent {
  public get firstDay(): Date {
    return this.state.startDate;
  }

  public get lastDay(): Date {
    return this.state.endDate;
  }

  public get occurrences(): readonly Occurrence[] {
    return this.state.occurrences;
  }

  constructor(public state: AppStateService) { }


}
