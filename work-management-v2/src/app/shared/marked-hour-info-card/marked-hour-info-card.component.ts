import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as moment from 'moment';
import { Hour } from 'src/app/state/hours/hour.model';
import { formatHoursTotal } from 'src/app/utils/functions';

@Component({
  selector: 'app-marked-hour-info-card',
  templateUrl: './marked-hour-info-card.component.html',
  styleUrls: ['./marked-hour-info-card.component.scss'],
})
export class MarkedHourInfoCardComponent {
  private _hour: Hour | undefined;

  date!: string;
  type!: string;
  hour!: string;


  @Output() removeEmit = new EventEmitter();

  @Input()
  set setHour(value: Hour) {
    if (!value) return;
    this._hour = value;

    const { updatedAt: date, marked: hour, worktypeName: type } = value;
    if (!date || !hour || !type) return;

    this.type = type;
    this.date = moment(date).format('ddd, MMMM Do YYYY');
    this.hour = formatHoursTotal(hour);
  }

  removeItem() {
    this.removeEmit.emit(this._hour);
  }
}
