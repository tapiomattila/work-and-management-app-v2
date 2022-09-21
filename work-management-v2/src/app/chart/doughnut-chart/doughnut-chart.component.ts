import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss'],
})
export class DoughnutChartComponent implements OnInit {

  dataArr: number[] = [];
  doughnutChartLabels: string[] = [];

  @Input()
  set setLabels(value: string[]) {
    if (value?.length === 0) return;
    value.forEach(el => this.doughnutChartLabels.push(el))
  }
  @Input()
  set dataSet(value: number[]) {
    if (value?.length === 0) return;
    value.forEach(el => this.dataArr.push(el));
  }
  doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: this.dataArr },
    ],
  };
  doughnutChartType: ChartType = 'doughnut';

  constructor() {}

  ngOnInit(): void {}

  chartClicked({ event, active }: { event: ChartEvent; active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: ChartEvent; active: {}[] }): void {
    console.log(event, active);
  }
}
