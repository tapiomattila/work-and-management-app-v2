import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddHoursPageComponent } from './pages/add-hours-page/add-hours-page.component';
import { HoursListPageComponent } from './pages/hours-list-page/hours-list-page.component';
import { SelectedWorksiteComponent } from './pages/selected-worksite/selected-worksite.component';
import { StatisticsPageComponent } from './pages/statistics-page/statistics-page.component';
import { WorksiteListComponent } from './pages/worksite-list/worksite-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/selected', pathMatch: 'full' },
  { path: 'selected', component: SelectedWorksiteComponent },
  { path: 'list', component: WorksiteListComponent },
  { path: 'add', component: AddHoursPageComponent },
  { path: 'add/:worksiteId', component: AddHoursPageComponent },
  { path: 'add/:worksiteId/:hourId', component: AddHoursPageComponent },
  { path: 'hours-list', component: HoursListPageComponent },
  { path: 'statistics', component: StatisticsPageComponent },
  { path: '**', redirectTo: '/selected' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }