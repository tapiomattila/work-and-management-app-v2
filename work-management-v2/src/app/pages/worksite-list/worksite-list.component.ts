import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
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
    private authService: AuthService,
    private dataService: DataService,
    private wsStore: WorksiteStoreService,
    private hoursStore: HoursStoreService
  ) { }

  ngOnInit(): void {
    this.worksites$ = this.authService.afAuth.authState.pipe(
      switchMap(auth => auth ? this.dataService.worksitesByUIDFetchOrStore(auth) : of([])),
      switchMap(worksites => worksites ? this.wsStore.mapHoursToWorksites(worksites, this.hoursStore.hours$) : of([]))
    );
  }

  test(worksite: Partial<Worksite> | undefined) {
    console.log('shwo worksite', worksite);
  }
}