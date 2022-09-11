import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { filter, map, shareReplay } from 'rxjs/operators';
import { HourQuery } from 'src/app/state/hours/hour.query';
import { Worksite } from 'src/app/state/worksites/worksite.model';
import { WorksiteQuery } from 'src/app/state/worksites/worksite.query';
import { ChartHour, Hour } from 'src/app/state/hours/hour.model';

@Component({
  selector: 'app-selected-worksite',
  templateUrl: './selected-worksite.component.html',
  styleUrls: ['./selected-worksite.component.scss'],
})
export class SelectedWorksiteComponent implements OnInit, OnDestroy {
  subs: Subscription | undefined;

  labelArray = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  worksitesSubs: Subscription | undefined;

  hours$: Observable<ChartHour[]> | undefined;
  total$: Observable<number | undefined> | undefined;
  totalForDay$: Observable<number | string | undefined> | undefined;
  mostRecentWorksite$: Observable<Worksite | null> | undefined;

  constructor(
    private worksiteQuery: WorksiteQuery,
    private hoursQuery: HourQuery
  ) { }

  ngOnInit(): void {
    this.mostRecentWorksite$ = this.mostRecentWorksite().pipe(shareReplay());
    this.total$ = this.hoursQuery.totalHours(this.mostRecentWorksite$);

    this.totalForDay$ = this.hoursQuery
      .totalHoursForDay(this.mostRecentWorksite$)
      .pipe(
        filter((el) => el !== undefined),
        map((el) => (!el ? '0h' : el))
      );

    this.hours$ = this.hoursQuery.selectFilterHoursByWorksite(this.mostRecentWorksite$).pipe(
      map(els => {
        if (!els) return [];
        return els.sort(
          (a, b) =>
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        )
      }),
      map((sorted) => {
        const weekHours = this.mapToWeekHours(sorted);
        const mapped = this.mapToChartHours(weekHours);

        const indexedObj: { [prop: number]: ChartHour } = {}

        mapped.forEach((el) => {
          if (!indexedObj[el.num]) {
            indexedObj[el.num] = el;
          } else {
            indexedObj[el.num].hours += el.hours;
          }
        });

        const filledArray = new Array(7);
        filledArray.fill(0);

        for (const [i, el] of Object.entries(indexedObj)) {
          filledArray[el.num - 1] = el;
        }

        return filledArray;
      }),
      filter((el) => el.length !== 0)
    );
  }

  mapToChartHours(weekHours: Hour[]) {
    return weekHours.map((el) => {
      const utc = new Date(el.updatedAt).toUTCString();
      let startDay = moment(utc).startOf('day');
      let date = new Date(startDay.toISOString());
      let weekday = new Date(date).getDay();
      const weekDayName = moment(new Date(date)).format('ddd');
      const hoursMarked = el.marked;
      weekday === 0 ? (weekday = 7) : weekday;

      const chartHour: ChartHour = {
        num: weekday,
        day: weekDayName,
        hours: hoursMarked,
      };
      return chartHour;
    });
  }

  mapToWeekHours(sorted: Hour[]) {
    const currentDate = new Date();
    const startWeek = moment(currentDate).startOf('week');

    return sorted.filter(
      (el) => {
        const testDate = new Date(el.updatedAt).getDate();
        const testMonth = new Date(el.updatedAt).getMonth() + 1;
        const weekDate = startWeek.date() + 1;
        const weekMonth = moment(currentDate).month() + 1;
        return testDate >= weekDate && testMonth === weekMonth;
      }
    );
  }

  /**
   * Query for most recent worksite by hours added.
   * @returns Obsevable<Worksite | null>
   */
  mostRecentWorksite() {
    return this.hoursQuery.selectMostRecentHourWorksite(
      this.worksiteQuery.worksites$
    );
  }

  isCurrentDayTotalString(value: number | string) {
    return typeof value === 'string';
  }

  isCurrentDayTotalNumber(value: number | string) {
    return typeof value === 'number';
  }

  convertToNumber(value: number | string) {
    return +value;
  }

  ngOnDestroy(): void {
    this.worksitesSubs?.unsubscribe();
  }
}
