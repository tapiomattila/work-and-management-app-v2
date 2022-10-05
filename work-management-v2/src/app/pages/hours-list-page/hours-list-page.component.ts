import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Worksite } from 'src/app/state/worksites/worksite.model';
import { WorksiteQuery } from 'src/app/state/worksites/worksite.query';

@Component({
  selector: 'app-hours-list-page',
  templateUrl: './hours-list-page.component.html',
  styleUrls: ['./hours-list-page.component.scss']
})
export class HoursListPageComponent implements OnInit {
  worksites$: Observable<Worksite[]> | undefined;

  constructor(
    private worksiteQuery: WorksiteQuery,
  ) { }

  ngOnInit(): void {
    this.worksites$ = this.worksiteQuery.worksites$;
  }
}
