import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { BarChartComponent } from './bar-chart/bar-chart.component';

@NgModule({
    imports: [
        CommonModule,
        NgChartsModule
    ],
    exports: [BarChartComponent],
    declarations: [BarChartComponent],
    providers: [],
})
export class ChartModule { }
