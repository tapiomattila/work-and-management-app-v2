import { Component, Input } from '@angular/core';
import { filter, map, Observable, of, switchMap } from 'rxjs';
import { HourQuery } from 'src/app/state/hours/hour.query';
import { Worksite } from 'src/app/state/worksites/worksite.model';
import { WorksiteService } from 'src/app/state/worksites/worksite.service';

@Component({
  selector: 'app-worksite-statistics',
  templateUrl: './worksite-statistics.component.html',
  styleUrls: ['./worksite-statistics.component.scss']
})
export class WorksiteStatisticsComponent {

  worksite$: Observable<Worksite | null> | undefined;
  data$: Observable<{ wtData: number[], wtNames: string[] }> | undefined;

  @Input()
  set setWorksite(value: Worksite) {
    if (!value) return;
    this.worksite$ = of(value);

    const dataNames: string[] = [];
    const dataArr: number[] = [];

    this.data$ = this.hourQuery.selectAll().pipe(
      filter(el => el.length > 0),
      switchMap(hours => {
        return of(this.wsService.mapHoursByWorktypeAndWorksite(value, hours));
      }),
      map(res => {
        Object.values(res).map(el => {
          dataArr.push(el.marked);
          dataNames.push(el.wtName);
        });
        return {
          wtNames: dataNames,
          wtData: dataArr
        }
      }),
    );
  }

  constructor(
    private wsService: WorksiteService,
    private hourQuery: HourQuery
  ) { }
}
