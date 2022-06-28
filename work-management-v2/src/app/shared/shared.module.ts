import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HoursChartComponent } from './hours-chart/hours-chart.component';
import { SmallCardComponent } from './small-card/small-card.component';
import { WorksiteInfoCardComponent } from './worksite-info-card/worksite-info-card.component';
import { HeaderComponent } from './header/header.component';
import { BackBtnComponent } from './back-btn/back-btn.component';
import { WorksiteListElementComponent } from './worksite-list-element/worksite-list-element.component';
import { HeaderProfileComponent } from './header-profile/header-profile.component';
import { MarkedHoursCardComponent } from './marked-hours-card/marked-hours-card.component';
import { MarkedHourInfoCardComponent } from './marked-hour-info-card/marked-hour-info-card.component';
import { GoogleSigninDirective } from '../utils/directives/google-signin.directive';
import { ChartModule } from '../chart/chart.module';

const components = [
  HeaderProfileComponent,
  HeaderComponent,
  WorksiteInfoCardComponent,
  HoursChartComponent,
  SmallCardComponent,
  BackBtnComponent,
  WorksiteListElementComponent,
  MarkedHoursCardComponent,
  MarkedHourInfoCardComponent,
  GoogleSigninDirective
];

const modules = [
  CommonModule,
  ChartModule
]

@NgModule({
  imports: [
    ...modules
  ],
  declarations: [
    ...components
  ],
  exports: [
    ...components
  ],
  providers: [],
})
export class SharedModule { }
