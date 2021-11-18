import { Component, Input, OnInit } from '@angular/core';
import { Occurrence } from 'src/app/models/occurrence';
import { AppStateService } from 'src/app/services/state/app-state.service';

@Component({
  selector: 'app-occurrence-card',
  templateUrl: './occurrence-card.component.html',
  styleUrls: ['./occurrence-card.component.sass']
})
export class OccurrenceCardComponent implements OnInit {
  @Input() occurrence!: Occurrence;
  @Input() occurrenceIndex!: number;

  constructor(
    public state: AppStateService
  ) { }

  ngOnInit(): void {
  }

}
