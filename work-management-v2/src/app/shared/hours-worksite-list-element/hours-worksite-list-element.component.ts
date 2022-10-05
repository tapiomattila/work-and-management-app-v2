import { Component, Input } from '@angular/core';
import { Hour } from 'src/app/state/hours/hour.model';

@Component({
  selector: 'app-hours-worksite-list-element',
  templateUrl: './hours-worksite-list-element.component.html',
  styleUrls: ['./hours-worksite-list-element.component.scss']
})
export class HoursWorksiteListElementComponent {

  hour!: Hour;

  @Input()
  set setHour(value: Hour) {
    if (!value) return;
    this.hour = value;
  }

  @Input() removeIcon = true;

  
}
