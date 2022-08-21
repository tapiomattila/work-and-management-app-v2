import { Component, Input, OnInit } from '@angular/core';
import { convertToHoursAndMinutes } from 'src/app/utils/functions';

@Component({
  selector: 'app-small-card',
  templateUrl: './small-card.component.html',
  styleUrls: ['./small-card.component.scss'],
})
export class SmallCardComponent implements OnInit {
  getValue: string | undefined;

  @Input() title: string | undefined;
  @Input() end: boolean = false;
  @Input() start: boolean = false;
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

  get getTitle() {
    return `${this.title}:`;
  }
}
