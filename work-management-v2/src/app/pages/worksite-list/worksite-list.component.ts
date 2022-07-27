import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HoursStoreService } from 'src/app/services/hours.store.service';
import { SessionQuery } from 'src/app/state/session/session.query';
import { WorksiteQuery } from 'src/app/state/worksites/worksite.query';
import { WorksiteService } from 'src/app/state/worksites/worksite.service';
import { Worksite } from 'src/app/utils/models/worksite.interface';

@Component({
  selector: 'app-worksite-list',
  templateUrl: './worksite-list.component.html',
  styleUrls: ['./worksite-list.component.scss'],
})
export class WorksiteListComponent implements OnInit {

  worksites$: Observable<Partial<Worksite>[] | undefined> | undefined;

  constructor(
    private hoursStore: HoursStoreService,
    private worksiteQuery: WorksiteQuery,
    private worksiteService: WorksiteService,
    private sessionQuery: SessionQuery
  ) { }

  ngOnInit(): void {
    this.worksiteService.clearWorksites();

    this.worksites$ = this.sessionQuery.uid$.pipe(
      switchMap(uid => this.worksiteQuery.selectWorksitesByUID(uid)),
      switchMap((worksites: Worksite[]) => worksites.length ? this.worksiteService.mapHoursToWorksites(worksites, this.hoursStore.hours$) : of([])),
    );
  }

  // test(worksite: Partial<Worksite> | undefined) {
  //   console.log('shwo worksite', worksite);
  // }
}