import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Worksite } from 'src/app/state/worksites/worksite.model';
import { MINUTESINHOUR } from 'src/app/utils/configs/app.config';
import { formatHoursTotal } from 'src/app/utils/functions';

@Component({
  selector: 'app-worksite-info-card',
  templateUrl: './worksite-info-card.component.html',
  styleUrls: ['./worksite-info-card.component.scss'],
})
export class WorksiteInfoCardComponent implements OnInit {

  @Input() worksite$: Observable<Worksite | null> | undefined;
  @Input() showAddress: boolean | undefined;
  @Input() showTotal: boolean | undefined;
  @Input() bgBlue: boolean | undefined;

  constructor() { }

  ngOnInit(): void { }

  getAddresss(worksite: Worksite) {
    if (!worksite?.info) return;
    return `${worksite.info.streetAddress}, ${worksite.info.postalCode} ${worksite.info.city}`;
  }

  getFormatHours(marked: number | undefined) {
    if (marked === 0) return '0h'
    if (!marked) return;
    return formatHoursTotal(marked / MINUTESINHOUR);
  }

  checkMarked(worksite: Worksite) {
    if (!worksite?.marked) return;
    return !!worksite.marked ?? false;
  }
}
