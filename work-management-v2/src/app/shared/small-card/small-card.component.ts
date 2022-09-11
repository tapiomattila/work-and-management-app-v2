import { Component, Input, OnInit } from '@angular/core';
import { MINUTESINHOUR } from 'src/app/utils/configs/app.config';
import { formatHoursTotal } from 'src/app/utils/functions';

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
    if (!value) return;
    this.getValue = formatHoursTotal(value / MINUTESINHOUR);
  }

  constructor() {}

  ngOnInit(): void {}

  get getTitle() {
    return `${this.title}:`;
  }
}
