import { Component, Input, OnInit } from '@angular/core';
import { convertToHoursAndMinutes } from 'src/app/utils/functions';

@Component({
  selector: 'app-worksite-list-element',
  templateUrl: './worksite-list-element.component.html',
  styleUrls: ['./worksite-list-element.component.scss'],
})
export class WorksiteListElementComponent implements OnInit {
  getValue: string | undefined;

  @Input() name: string | undefined;

  @Input()
  set minutes(minutes: number | undefined) {
    if (minutes) {
      const hours = minutes / 60;
      const isFullHours = Number.isInteger(hours);
  
      if (!isFullHours) {
        const convert = convertToHoursAndMinutes(minutes);
        this.getValue = `${convert.hours}h ${convert.minutes}min`;
      } else {
        this.getValue = `${hours}h`;
      }
    }
  }

  constructor() {}

  ngOnInit(): void {}
}
