import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { Hour } from 'src/app/state/hours/hour.model';
import { formatHoursTotal } from 'src/app/utils/functions';

@Component({
  selector: 'app-marked-hour-info-card',
  templateUrl: './marked-hour-info-card.component.html',
  styleUrls: ['./marked-hour-info-card.component.scss'],
})
export class MarkedHourInfoCardComponent {
  date!: string;
  type!: string;
  hour!: string;

  @Input()
  set setHour(value: Hour) {
    if (!value) return;

    const { updatedAt: date, marked: hour, worktypeName: type } = value;
    if (!date || !hour || !type) return;

    this.type = type;
    this.date = moment(date).format('ddd, MMMM Do YYYY');
    this.hour = formatHoursTotal(hour);
  }
}
