import { Component, Input, OnInit } from '@angular/core';
import { ChartHour } from 'src/app/state/hours/hour.model';

@Component({
  selector: 'app-hours-chart',
  templateUrl: './hours-chart.component.html',
  styleUrls: ['./hours-chart.component.scss']
})
export class HoursChartComponent implements OnInit {

  @Input() label = '';
  @Input() hoursArray: ChartHour[] = [];
  @Input() labelArray: string[] = [];

  constructor() { }

  ngOnInit(): void { }
}
