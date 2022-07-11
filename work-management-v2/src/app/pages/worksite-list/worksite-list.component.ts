import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { HoursStoreService } from 'src/app/services/hours.store.service';
import { WorksiteStoreService } from 'src/app/services/worksite.store.service';
import { Worksite } from 'src/app/utils/models/worksite.interface';

@Component({
  selector: 'app-worksite-list',
  templateUrl: './worksite-list.component.html',
  styleUrls: ['./worksite-list.component.scss'],
})
export class WorksiteListComponent implements OnInit {

  worksites$: Observable<Partial<Worksite>[] | undefined> | undefined;

  constructor(
    private wsStore: WorksiteStoreService,
    private hoursStore: HoursStoreService
  ) { }

  ngOnInit(): void {
    this.wsStore.clearWorksites();

    // worksites.length ? this.wsStore.mapHoursToWorksites(worksites, this.hoursStore.hours$) : of([])
    // this.worksites$ =
    const test$ =this.wsStore.fetchOrStoreWorksitesByUID().pipe(
      // tap(() => this.wsStore.clearWorksites()),
      // tap(res => console.log('fetch ws', res)),
      switchMap((worksites: Worksite[]) => worksites.length ? this.wsStore.mapHoursToWorksites(worksites, this.hoursStore.hours$) : of([])),
      // tap(res => console.log('marked ws: ', res))
    );

    test$.subscribe(res => console.log('fe res', res));
    this.worksites$ = test$;


    // TODO
    // figure why double render appears
  }

  // test(worksite: Partial<Worksite> | undefined) {
  //   console.log('shwo worksite', worksite);
  // }
}