import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartHour } from 'src/app/state/hours/hour.model';

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
  set setData(value: ChartHour[]) {
    const filledArray = value.map(el => {
      if (el) {
        return el.hours
      } else {
        return 0;
      }
    });
    this.dataArr = [...filledArray];

    this.barChartData = [];
    this.barChartData.push({
      data: this.dataArr,
      label: this.header,
      hoverBackgroundColor: '#776bea',
      borderCapStyle: 'round',
      borderRadius: 20,
      barThickness: 28
    })
  }

  labels: string[] = [];
  dataArr: number[] = [];
  @Input() header = 'Daily hours';

  barChartOptions: ChartOptions = {
    responsive: true,
    backgroundColor: '#bfdff4',
    borderColor: 'rgba(225,10,24,0.2)',

  };
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
