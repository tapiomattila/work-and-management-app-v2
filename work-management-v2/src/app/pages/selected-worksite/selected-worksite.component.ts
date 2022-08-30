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
  ) {}

  ngOnInit(): void {
    this.mostRecentWorksite$ = this.mostRecentWorksite().pipe(shareReplay());
    this.total$ = this.hoursQuery.totalHours(this.mostRecentWorksite$);

    this.totalForDay$ = this.hoursQuery
      .totalHoursForDay(this.mostRecentWorksite$)
      .pipe(
        filter((el) => el !== undefined),
        map((el) => (!el ? 'No data' : el))
      );

    this.hours$ = this.hoursQuery.selectAll().pipe(
      map((els) =>
        els.sort(
          (a, b) =>
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        )
      ),
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
      let weekday = new Date(utc).getUTCDay();
      const weekDayName = moment(new Date(el.updatedAt)).format('ddd');
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
    const end = moment(currentDate).endOf('week').add(1);
    console.log('end: ', end.format('ddd, MMMM Do YYYY'));

    const test = sorted.filter(
      (el) => {
        const testTime = new Date(el.updatedAt).getTime();
        const testDate = new Date(el.updatedAt).getDate();
        
        const startTime = new Date(startWeek.toISOString()).getTime();
        const startDate = new Date(startWeek.toISOString()).getDate();

        const endTime = new Date(startWeek.toISOString()).getTime();
        const endDate = new Date(startWeek.toISOString()).getDate();

        console.log('show filter 1: ', testTime, testDate);
        console.log('show filter 2: ', startTime, startDate);
        console.log('show filter 3: ', endTime, endDate);
        
        const isInRange = testDate >= startDate;

        if (isInRange) {
          console.log('date', startDate, endDate, testDate);
        }
        // new Date(el.updatedAt).getTime() >=
        // new Date(startWeek.toISOString()).getTime()

        return isInRange;
      }
      
    );

    console.log('test chart', test);

    // const lastElement = sorted[sorted.length - 1];
    // const startWeek = moment(lastElement?.updatedAt).startOf('week');
    return test;
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
