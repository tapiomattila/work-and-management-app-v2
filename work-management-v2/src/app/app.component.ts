import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointState } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { BreakpointService } from './services/breakpoint.service';
import { DataService } from './services/data.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './services/auth.service';
import { WorksiteStoreService } from './services/worksite.store.service';
import { shareReplay, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  observerSub: Subscription[] = [];

  /**
   * TODO
   * - add hours material components
   * - chart.js chart on selected page
   * - sel func
   */
  constructor(
    private dataService: DataService,
    private wsStore: WorksiteStoreService,
    public bpService: BreakpointService,
    public afAuth: AngularFireAuth,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    const break800$ = this.bpService.observeBreakpoint().subscribe((state: BreakpointState) => {
      state.matches && !this.bpService.over1200 ? this.bpService.isHeader = false : this.bpService.isHeader = true;
    });
    this.observerSub.push(break800$);

    const authStateChange$ = this.afAuth.authState.pipe(
      shareReplay()
    );

    const hours$ = this.getUserHours(authStateChange$).subscribe(res => console.log('hours: ', res));
    const worksites$ = this.getUserWorksites(authStateChange$).subscribe(res => console.log('ws: ', res));

    this.observerSub.push(hours$);
    this.observerSub.push(worksites$);
  }

  getUserHours(authChange$: Observable<firebase.default.User | null>) {
    return authChange$.pipe(
      switchMap(auth => {
        if (auth) {
          return this.dataService.hoursByUIDFetchOrStore(auth);
        } else {
          return [];
        }
      })
    );
  }

  getUserWorksites(authChange$: Observable<firebase.default.User | null>) {
    return authChange$.pipe(
      tap(() => this.wsStore.clearWorksites()),
      switchMap(auth => {
        if (auth) {
          return this.dataService.worksitesByUIDFetchOrStore(auth);
        } else {
          return [];
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.observerSub.forEach(el => el.unsubscribe());
    this.authService.authSubscription?.unsubscribe();
  }
}
