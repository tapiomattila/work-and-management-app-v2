import { Component, OnDestroy, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HoursStoreService } from 'src/app/services/hours.store.service';
import { WorksiteStoreService } from 'src/app/services/worksite.store.service';
import { hoursReduce, mostRecentWorksite } from 'src/app/utils/functions';
import { Worksite } from 'src/app/utils/models/worksite.interface';

@Component({
  selector: 'app-selected-worksite',
  templateUrl: './selected-worksite.component.html',
  styleUrls: ['./selected-worksite.component.scss'],
})
export class SelectedWorksiteComponent implements OnInit, OnDestroy {

  worksitesSubs: Subscription | undefined;

  total$: Observable<number | undefined> | undefined;
  minutesInHour = 60;

  totalForDay$: Observable<any | undefined> | undefined;
  mostRecentWorksite$: Observable<Worksite | undefined> | undefined;

  constructor(
    private wsStore: WorksiteStoreService,
    private hourStore: HoursStoreService,
  ) { }

  ngOnInit(): void {
    this.mostRecentWorksite$ = this.wsStore.worksites$.pipe(
      map(res => mostRecentWorksite(res)),
    );

    // total hours for worksite
    this.total$ = this.mostRecentWorksite$.pipe(
      switchMap(ws => {
        return ws ? this.hourStore.selectHoursByWorksite(ws.id) : [];
      }),
      map(hours => {
        return hoursReduce(hours);
      })
    )

    // // total hours for current day
    this.totalForDay$ = this.mostRecentWorksite$.pipe(
      switchMap(ws => {
        if (!ws) return of(undefined);
        return this.hourStore.selectCurrentDayHoursByWorksite(ws.id);
      }),
    );
  }

  ngOnDestroy(): void {
    this.worksitesSubs?.unsubscribe();
  }
}
