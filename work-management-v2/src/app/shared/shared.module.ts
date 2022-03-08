import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderProfileComponent } from './header-profile/header-profile.component';
import { HoursChartComponent } from './hours-chart/hours-chart.component';
import { SmallCardComponent } from './small-card/small-card.component';
import { WorksiteInfoCardComponent } from './worksite-info-card/worksite-info-card.component';

@NgModule({
  imports: [CommonModule],
  exports: [
    HeaderProfileComponent,
    WorksiteInfoCardComponent,
    HoursChartComponent,
    SmallCardComponent,
  ],
  declarations: [
    HeaderProfileComponent,
    WorksiteInfoCardComponent,
    HoursChartComponent,
    SmallCardComponent,
  ],
  providers: [],
})
export class SharedModule {}
