import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';

import { MatSliderModule } from '@angular/material/slider';

const modules = [
    CommonModule,

    // button
    MatButtonModule,
    MatIconModule,

    // datepicker
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,

    MatSelectModule,

    MatSliderModule
]

@NgModule({
    imports: [
        CommonModule,
        ...modules
    ],
    exports: [
        ...modules
    ],
    declarations: [],
    providers: [],
})
export class MaterialModule { }
