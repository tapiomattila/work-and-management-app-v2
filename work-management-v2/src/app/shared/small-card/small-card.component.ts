import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MINUTESINHOUR } from 'src/app/utils/configs/app.config';
import { formatHoursTotal } from 'src/app/utils/functions';

@Component({
  selector: 'app-small-card',
  templateUrl: './small-card.component.html',
  styleUrls: ['./small-card.component.scss'],
})
export class SmallCardComponent implements OnInit {
  @Input() total$: Observable<number | string | undefined> | undefined;
  @Input() title: string | undefined;

  constructor() {}

  ngOnInit(): void {}

  getFormatHours(marked: number | string | undefined) {
    if (!marked) return;
    if (typeof marked === 'string') return '0h';
    return formatHoursTotal(marked / MINUTESINHOUR);
  }
}
