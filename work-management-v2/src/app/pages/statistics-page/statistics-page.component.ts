import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Worksite } from 'src/app/state/worksites/worksite.model';
import { WorksiteQuery } from 'src/app/state/worksites/worksite.query';

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
  ) {}

  ngOnInit(): void {
    this.worksites$ = this.worksiteQuery.worksites$;
  }

  setWorksiteOf(worksite: Worksite) {
    return of(worksite);
  }
}
