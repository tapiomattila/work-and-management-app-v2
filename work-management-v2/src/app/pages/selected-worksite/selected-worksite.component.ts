import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { HourQuery } from 'src/app/state/hours/hour.query';
import { Worksite } from 'src/app/state/worksites/worksite.model';
import { WorksiteQuery } from 'src/app/state/worksites/worksite.query';

@Component({
  selector: 'app-selected-worksite',
  templateUrl: './selected-worksite.component.html',
  styleUrls: ['./selected-worksite.component.scss'],
})
export class SelectedWorksiteComponent implements OnInit, OnDestroy {

  worksitesSubs: Subscription | undefined;

  total$: Observable<number | undefined> | undefined;
  totalForDay$: Observable<number | undefined> | undefined;
  mostRecentWorksite$: Observable<Worksite | null> | undefined;

  constructor(
    private worksiteQuery: WorksiteQuery,
    private hoursQuery: HourQuery
  ) { }

  ngOnInit(): void {
    this.mostRecentWorksite$ = this.mostRecentWorksite().pipe(
      shareReplay()
    );
    this.total$ = this.hoursQuery.totalHours(this.mostRecentWorksite$);
    this.totalForDay$ = this.hoursQuery.totalHoursForDay(this.mostRecentWorksite$);
  }

  /**
   * Query for most recent worksite by hours added.
   * @returns Obsevable<Worksite | null>
   */
  mostRecentWorksite() {
    return this.hoursQuery.selectMostRecentHourWorksite(this.worksiteQuery.worksites$);
  }

  ngOnDestroy(): void {
    this.worksitesSubs?.unsubscribe();
  }
}
