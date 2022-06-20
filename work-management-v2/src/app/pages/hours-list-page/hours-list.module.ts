import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HoursListPageComponent } from './hours-list-page.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        HoursListPageComponent
    ],
    providers: [],
})
export class HoursListModule { }
