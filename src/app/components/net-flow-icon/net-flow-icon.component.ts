import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-net-flow-icon',
  templateUrl: './net-flow-icon.component.html',
  styleUrls: ['./net-flow-icon.component.sass']
})
export class NetFlowIconComponent implements OnInit {
  @Input() netFlow!: number;

  get colorClass(): string {
    return this.netFlow < 0
      ? 'text-danger'
      : 'text-success';
  }

  constructor() { }

  ngOnInit(): void {
  }

}
