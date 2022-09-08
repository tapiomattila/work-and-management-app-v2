import { Component, Input } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { Hour } from 'src/app/state/hours/hour.model';
import { HourQuery } from 'src/app/state/hours/hour.query';
import { Worksite } from 'src/app/state/worksites/worksite.model';

@Component({
  selector: 'app-hours-worksite-list',
  templateUrl: './hours-worksite-list.component.html',
  styleUrls: ['./hours-worksite-list.component.scss']
})
export class HoursWorksiteListComponent {

  title: string | undefined;
  address: string | undefined;
  totalHours: number | undefined;
  sortedHours$: Observable<Hour[]> | undefined;

  @Input()
  set setWorksite(value: Worksite) {
    if (!value?.info) return;

    // TODO: sort hours
    this.sortedHours$ = this.hourQuery.selectHoursByWorksite(value.id).pipe(
      delay(2000)
    );

    this.title = value.name;
    this.address = `${value.info.streetAddress}, ${value.info.postalCode} ${value.info.city}`;
    
    // temp for loading
    setTimeout(() => {
      // TODO: calculate total hours from store
      this.totalHours = 102;
    }, 1200);
  }

  constructor(
    private hourQuery: HourQuery
  ) { }
}
