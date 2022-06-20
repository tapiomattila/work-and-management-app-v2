import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// components
import { NavigationBarComponent } from './layout/navigation-bar/navigation-bar.component';

// Misc
import { SharedModule } from './shared/shared.module';

// Features
import { SelectedWorksiteModule } from './pages/selected-worksite/selected-worksite.module';
import { WorksiteListModule } from './pages/worksite-list/worksite-list.module';
import { AddHoursPageModule } from './pages/add-hours-page/add-hours-page.module';
import { HoursListModule } from './pages/hours-list-page/hours-list.module';

@NgModule({
  declarations: [AppComponent, NavigationBarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    WorksiteListModule,
    SelectedWorksiteModule,
    AddHoursPageModule,
    HoursListModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
