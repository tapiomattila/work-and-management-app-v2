import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/libraries/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddHoursPageComponent } from './add-hours-page.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [],
    declarations: [
        AddHoursPageComponent
    ],
    providers: [],
})
export class AddHoursPageModule { }
