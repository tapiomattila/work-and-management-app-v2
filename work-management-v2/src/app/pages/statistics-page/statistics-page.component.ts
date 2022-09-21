import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HourQuery } from 'src/app/state/hours/hour.query';
import { Worksite } from 'src/app/state/worksites/worksite.model';
import { WorksiteQuery } from 'src/app/state/worksites/worksite.query';
import { WorksiteService } from 'src/app/state/worksites/worksite.service';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss'],
})
export class StatisticsPageComponent implements OnInit {
  worksites$: Observable<Worksite[]> | undefined;
  worksite$: Observable<Worksite> | undefined;

  constructor(
    private worksiteQuery: WorksiteQuery,
    private worksiteService: WorksiteService,
    private hourQuery: HourQuery
  ) {}

  ngOnInit(): void {
    this.worksites$ = this.worksiteQuery.worksites$;

    setTimeout(() => {
      const worksites = this.worksiteQuery.getAll();
      const hours = this.hourQuery.getAll();
      this.worksiteService.mapHoursByWorktypeAndWorksite(worksites[0], hours);
    }, 3000);
  }

  setWorksiteOf(worksite: Worksite) {
    return of(worksite);
  }
}
