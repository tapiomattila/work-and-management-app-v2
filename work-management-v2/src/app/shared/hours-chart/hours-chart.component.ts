import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hours-chart',
  templateUrl: './hours-chart.component.html',
  styleUrls: ['./hours-chart.component.scss']
})
export class HoursChartComponent implements OnInit {

  label = 'Best fruits';
  labelArr = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  dataArr = [9, 4, 13, 10, 6, 6, 8];

  constructor() { }

  ngOnInit(): void {
    this.label = 'Best fruits';
  }
}
