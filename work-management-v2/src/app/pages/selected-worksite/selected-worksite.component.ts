import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { mostRecentWorksite } from 'src/app/utils/functions';
import { Worksite } from 'src/app/utils/models/worksite.interface';

@Component({
  selector: 'app-selected-worksite',
  templateUrl: './selected-worksite.component.html',
  styleUrls: ['./selected-worksite.component.scss'],
})
export class SelectedWorksiteComponent implements OnInit, OnDestroy {

  worksitesSubs: Subscription | undefined;
  worksites$: Observable<Worksite[]> | undefined;

  mostRecentWorksite$: Observable<Worksite | undefined> | undefined;

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // const ws$ = this.dataService.worksites$;
    // this.worksitesSubs = this.dataService.


    // this.worksites$ = this.dataService.worksites$;
    // this.worksitesSubs = this.dataService.getWorksitesStoreOrFetch().subscribe();
    // // this.dataService.getWorksitesStoreOrFetch().subscribe();
    // // this.worksites$.subscribe(res => console.log('worksites res', res));

    // // const data$ = this.dataService.fetchWorksites();
    // // data$.subscribe(res => console.log(res));

    // this.worksites$.subscribe(res => console.log('show res ws', res));

    // this.mostRecentWorksite$ = this.worksites$.pipe(
    //   map(res => mostRecentWorksite(res)),
    // );

    // // this.mostRecentWorksite$.subscribe(res => console.log('shwo recent', res));


    // const test$ = this.authService.isAuthenticated$.pipe(
    //   switchMap(auth => {
    //     console.log('show auth', auth);
    //     return this.authService.worksitesByUID();
    //   }),
    //   switchMap(() => {
    //     return this.
    //   })
    // );

    // test$.subscribe(res => console.log('shwo ws by uid: ', res));
  }

  ngOnDestroy(): void {
    this.worksitesSubs?.unsubscribe();
  }
}


/**
 * - select user worksites
 * - get most recent changes
 * - select user hours
 * - collect hours for recent worksites (by uid)
 * - collect hours for current day
 */