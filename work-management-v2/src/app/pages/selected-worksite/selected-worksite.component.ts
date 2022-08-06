import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HourQuery } from 'src/app/state/hours/hour.query';
import { Worksite } from 'src/app/state/worksites/worksite.model';
import { WorksiteQuery } from 'src/app/state/worksites/worksite.query';
import { hoursReduce, mostRecentWorksite } from 'src/app/utils/functions';

@Component({
  selector: 'app-selected-worksite',
  templateUrl: './selected-worksite.component.html',
  styleUrls: ['./selected-worksite.component.scss'],
})
export class SelectedWorksiteComponent implements OnInit, OnDestroy {

  worksitesSubs: Subscription | undefined;

  total$: Observable<number | undefined> | undefined;
  minutesInHour = 60;

  totalForDay$: Observable<number | undefined> | undefined;
  mostRecentWorksite$: Observable<Worksite | null> | undefined;

  constructor(
    private worksiteQuery: WorksiteQuery,
    private hoursQuery: HourQuery
  ) { }

  ngOnInit(): void {
    this.mostRecentWorksite$ = this.worksiteQuery.worksites$.pipe(
      map(res => mostRecentWorksite(res))
    )

    // total hours for worksite
    this.total$ = this.mostRecentWorksite$.pipe(
      switchMap(ws => {
        return ws ? this.hoursQuery.selectHoursByWorksite(ws.id) : [];
      }),
      map(hours => {
        return hoursReduce(hours);
      })
    )

    // // total hours for current day
    this.totalForDay$ = this.mostRecentWorksite$.pipe(
      switchMap(ws => {
        if (!ws) return of(undefined);
        return this.hoursQuery.selectCurrentDayHoursByWorksite(ws.id);
      }),
    );
  }

  ngOnDestroy(): void {
    this.worksitesSubs?.unsubscribe();
  }
}
