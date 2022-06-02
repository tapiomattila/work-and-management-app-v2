import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddHoursPageComponent } from './add-hours-page.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        AddHoursPageComponent
    ],
    providers: [],
})
export class AddHoursPageModule { }
