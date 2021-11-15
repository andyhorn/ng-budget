import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-net-flow-icon',
  templateUrl: './net-flow-icon.component.html',
  styleUrls: ['./net-flow-icon.component.sass']
})
export class NetFlowIconComponent implements OnInit {
  @Input() netFlow!: number;
  @Input() dark: boolean = false;

  get colorClass(): string {
    return this.netFlow < 0
      ? this.dark ? 'text-danger' : 'text-danger-light'
      : this.dark ? 'text-success' : 'text-success-light';
  }

  constructor() { }

  ngOnInit(): void {
  }

}
