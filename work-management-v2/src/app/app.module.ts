import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { SelectedWorksiteComponent } from './pages/selected-worksite/selected-worksite.component';
import { SelectedWorksiteModule } from './pages/selected-worksite/selected-worksite.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, NavigationComponent, SelectedWorksiteComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    SelectedWorksiteModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
