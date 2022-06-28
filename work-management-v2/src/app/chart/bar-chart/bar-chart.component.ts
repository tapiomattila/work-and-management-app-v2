import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  @Input()
  set setLabels(value: string[]) {
    if (value.length) {
      value.forEach(el => this.labels.push(el))
    }
  }

  @Input()
  set setData(value: number[]) {
    if (value.length) {
      value.forEach(el => this.dataArr.push(el));
    }
  }

  labels: string[] = [];
  dataArr: number[] = [];
  @Input() header = 'Best fruits22';

  barChartOptions: ChartOptions = {
    responsive: true,
    backgroundColor: '#bfdff4',
    borderColor: 'rgba(225,10,24,0.2)',

  };
  // colorOptions: CommonHoverOptions = {
  //   hoverBackgroundColor: "#fff",
  //   hoverBorderColor: "#000",
  //   hoverBorderWidth: 2
  // }
  barChartLabels: BaseChartDirective["labels"] = this.labels
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartPlugins = [];
  barChartData: ChartDataset[] = [
    {
      data: this.dataArr,
      label: this.header,
      hoverBackgroundColor: '#776bea',
      borderCapStyle: 'round',
      borderRadius: 20,
      barThickness: 28
     },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
