import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';

@NgModule({
    imports: [
        CommonModule,
        NgChartsModule
    ],
    exports: [
        BarChartComponent,
        PieChartComponent,
        DoughnutChartComponent
    ],
    declarations: [
        BarChartComponent,
        PieChartComponent,
        DoughnutChartComponent
    ],
    providers: [],
})
export class ChartModule { }
