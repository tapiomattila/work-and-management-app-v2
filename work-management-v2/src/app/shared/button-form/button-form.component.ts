import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-form-button',
    templateUrl: 'button-form.component.html',
    styleUrls: ['button-form.component.scss']
})
export class ButtonFormComponent implements OnInit {

    @Input() form: FormGroup | undefined;
    @Input() text: string | undefined;
    @Output() buttonClick = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    event() {
        this.buttonClick.emit(this.form);
    }
}
