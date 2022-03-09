import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorksiteListComponent } from './worksite-list.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  exports: [],
  declarations: [WorksiteListComponent],
  providers: [],
})
export class WorksiteListModule {}
