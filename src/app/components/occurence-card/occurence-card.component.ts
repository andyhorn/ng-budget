import { Component, Input, OnInit } from '@angular/core';
import { Occurrence } from 'src/app/models/occurrence';

@Component({
  selector: 'app-occurence-card',
  templateUrl: './occurence-card.component.html',
  styleUrls: ['./occurence-card.component.sass']
})
export class OccurenceCardComponent implements OnInit {
  @Input() occurrence!: Occurrence;
  @Input() index!: number;

  constructor() { }

  ngOnInit(): void {
  }

}
