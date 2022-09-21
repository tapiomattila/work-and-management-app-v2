import { Component, OnInit, Input } from '@angular/core';
import { HourQuery } from 'src/app/state/hours/hour.query';
import { Worksite } from 'src/app/state/worksites/worksite.model';
import { WorksiteService } from 'src/app/state/worksites/worksite.service';
import { delay, map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-worksite-statistics',
  templateUrl: './worksite-statistics.component.html',
  styleUrls: ['./worksite-statistics.component.scss']
})
export class WorksiteStatisticsComponent implements OnInit {

  worksite$: Observable<Worksite | null> | undefined;

  @Input()
  set setWorksite(value: Worksite) {
    if (!value) return;

    this.worksite$ = this.wsService.mapHoursToWorksites([value], this.hourQuery.selectAll()).pipe(
      map(els => els[0]),
      delay(500),
    );
  }

  constructor(
    private wsService: WorksiteService,
    private hourQuery: HourQuery
  ) { }

  ngOnInit(): void {
  }

}
