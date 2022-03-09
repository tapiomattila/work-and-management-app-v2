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
  set value(value: number) {
    const hours = value / 60;
    const isFullHours = Number.isInteger(hours);

    if (!isFullHours) {
      const convert = convertToHoursAndMinutes(value);
      this.getValue = `${convert.hours}h ${convert.minutes}min`;
    } else {
      this.getValue = `${hours}h`;
    }
  }

  constructor() {}

  ngOnInit(): void {}
}
