import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Hour } from 'src/app/state/hours/hour.model';
import { HourQuery } from 'src/app/state/hours/hour.query';
import { SessionQuery } from 'src/app/state/session/session.query';
import { Worksite } from 'src/app/state/worksites/worksite.model';
import { WorksiteQuery } from 'src/app/state/worksites/worksite.query';
import { WorksiteService } from 'src/app/state/worksites/worksite.service';

@Component({
  selector: 'app-worksite-list',
  templateUrl: './worksite-list.component.html',
  styleUrls: ['./worksite-list.component.scss'],
})
export class WorksiteListComponent implements OnInit {

  worksites$: Observable<Partial<Worksite>[] | undefined> | undefined;

  constructor(
    private hoursQuery: HourQuery,
    private worksiteQuery: WorksiteQuery,
    private worksiteService: WorksiteService,
    private sessionQuery: SessionQuery,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const uid$ = this.sessionQuery.uid$.pipe(
      filter(el => el !== '')
    );

    const worksites$ = this.worksiteQuery.worksites$.pipe(
      filter(el => el.length !== 0)
    )

    const hours$ = this.hoursQuery.selectAll().pipe(
      filter(el => el.length !== 0)
    );

    const combined$ = combineLatest([
      uid$,
      worksites$,
      hours$
    ]);

    this.worksites$ = combined$.pipe(
      switchMap((res: [string, Worksite[], Hour[]]) => {
        const [uid, ws, hours] = res;
        return this.worksiteQuery.selectWorksitesByUID(uid);
      }),
      switchMap(ws => this.worksiteService.mapHoursToWorksites(ws, hours$))
    );
  }

  select(ws: Partial<Worksite>) {
    console.log('show ws: ', ws.id);
    this.router.navigate(['add', ws.id]);
  }
}
