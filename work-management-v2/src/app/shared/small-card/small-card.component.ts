import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-small-card',
  templateUrl: './small-card.component.html',
  styleUrls: ['./small-card.component.scss'],
})
export class SmallCardComponent implements OnInit {
  getValue: string | undefined;

  @Input() title: string | undefined;
  @Input()
  set value(value: number) {
    const hours = value / 60;
    const isFullHours = Number.isInteger(hours);

    if (!isFullHours) {
      const convert = this.convertToHoursAndMinutes(value);
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

  convertToHoursAndMinutes(value: number) {
    let decimals = value / 60 - Math.floor(value / 60);
    const minutes = decimals * 60;
    const hours = (value - minutes) / 60;

    return {
      hours,
      minutes,
    };
  }
}
