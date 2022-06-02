import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { SelectedWorksiteModule } from './pages/selected-worksite/selected-worksite.module';
import { SharedModule } from './shared/shared.module';
import { WorksiteListModule } from './pages/worksite-list/worksite-list.module';
import { NavigationBarComponent } from './layout/navigation-bar/navigation-bar.component';
import { AddHoursPageModule } from './pages/add-hours-page/add-hours-page.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, NavigationComponent, NavigationBarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    WorksiteListModule,
    SelectedWorksiteModule,
    AddHoursPageModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
