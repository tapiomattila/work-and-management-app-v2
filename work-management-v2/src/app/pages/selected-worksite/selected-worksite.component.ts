import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HoursStoreService } from 'src/app/services/hours.store.service';
import { WorksiteStoreService } from 'src/app/services/worksite.store.service';
import { compareToCurrentDate, mostRecentWorksite } from 'src/app/utils/functions';
import { Hour } from 'src/app/utils/models/hours.interface';
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
    this.mostRecentWorksite$ = this.mostRecentWorksite();

    // total hours for worksite
    this.total$ = this.mostRecentWorksite$.pipe(
      switchMap(ws => {
        return ws ? this.hourStore.selectHoursByWorksiteID(ws.id) : [];
      }),
      map(hours => {
        return this.hoursReduce(hours);
      })
    )

    // // total hours for current day
    this.totalForDay$ = this.mostRecentWorksite$.pipe(
      switchMap(ws => {
        return ws ? this.hourStore.selectHoursByWorksiteID(ws.id) : [];
      }),
      map(hours => {
        return hours ? this.currentDayHours(hours) : [];
      }),
      map(hours => {
        return this.hoursReduce(hours);
      })
    );
  }

  hoursReduce(hours: Hour[]) {
    const marked = hours?.map(el => el.marked);
    const reduce = marked.reduce((prev, cur) => prev + cur, 0);
    const totalMinutes = reduce * this.minutesInHour;
    return totalMinutes;
  }

  currentDayHours(hours: Hour[]) {
    const currentDayHours: Hour[] = [];
    hours.forEach(el => {
      // if (compareToCurrentDate(el.updatedAt.toString())) {
      currentDayHours.push(el);
      // }
    })
    return currentDayHours;
  }

  // TODO:
  // when url id selected ws is implemented, change to selected worksite (or recent)
  mostRecentWorksite() {
    return this.wsStore.worksites$.pipe(
      map(res => mostRecentWorksite(res)),
    );
  }

  ngOnDestroy(): void {
    this.worksitesSubs?.unsubscribe();
  }
}
