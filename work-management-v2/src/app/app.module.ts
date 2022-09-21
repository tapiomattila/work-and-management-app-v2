import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

// Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { SETTINGS as AUTH_SETTINGS } from '@angular/fire/compat/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NavigationBarComponent } from './layout/navigation-bar/navigation-bar.component';

import { MaterialModule } from './libraries/material.module';
import { ChartModule } from './chart/chart.module';
import { SharedModule } from './shared/shared.module';
import { SelectedWorksiteModule } from './pages/selected-worksite/selected-worksite.module';
import { WorksiteListModule } from './pages/worksite-list/worksite-list.module';
import { AddHoursPageModule } from './pages/add-hours-page/add-hours-page.module';
import { HoursListModule } from './pages/hours-list-page/hours-list.module';
import { StatisticsPageComponent } from './pages/statistics-page/statistics-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    StatisticsPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    SelectedWorksiteModule,
    WorksiteListModule,
    AddHoursPageModule,
    HoursListModule,
    ChartModule,
    MaterialModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    { provide: AUTH_SETTINGS, useValue: { appVerificationDisabledForTesting: true } },
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
