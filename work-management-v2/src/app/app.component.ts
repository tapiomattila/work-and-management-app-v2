import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { BreakpointService } from './services/breakpoint.service';
import { AuthService } from './services/auth.service';
import { WorksiteStoreService } from './services/worksite.store.service';
import { debounceTime, distinctUntilChanged, shareReplay, tap } from 'rxjs/operators';
import { HoursStoreService } from './services/hours.store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  observerSub: Subscription[] = [];

  constructor(
    private wsStore: WorksiteStoreService,
    private hoursStore: HoursStoreService,
    public bpService: BreakpointService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    const break800$ = this.bpService.observeBreakpoint().subscribe((state: BreakpointState) => {
      state.matches && !this.bpService.over1200 ? this.bpService.isHeader = false : this.bpService.isHeader = true;
    });
    this.observerSub.push(break800$);

    const authStateChange$ = this.authService.selectAuthState()
      .pipe(
        shareReplay(),
        tap(auth => this.authService.changeAuthState(auth)),
      ).subscribe();

    const test$ = this.wsStore.fetchOrStoreWorksitesByUID().pipe(
      debounceTime(300),
      distinctUntilChanged()
    );
    test$.subscribe(res => console.log('show res in ws', res));

    // const test2$ = this.hoursStore.hoursByUID();
    const test2$ = this.hoursStore.fetchOrStoreHoursByUID();
    test2$.subscribe(res => console.log('show res in hours', res));

    // this.hoursStore.hourByID('SoLuubR9LQy9MuufPnuS').subscribe(res => console.log('hour', res));
    // this.hoursStore.hoursByWorksite('I28M8KZHqdU0alfhTKDQ').subscribe(res => console.log('hours by worksite', res));

    // const hours$ = this.getUserHours(authStateChange$).subscribe(res => console.log('hours: ', res));
    // const hours$ = this.hoursStore.selectUserHours().subscribe(res => console.log('hours: ', res));
    // const worksites$ = this.wsStore.selectUserWorksites().subscribe(res => console.log('ws: ', res));
    // const worksites$ = this.getUserWorksites(authStateChange$).subscribe(res => console.log('ws: ', res));

    // this.observerSub.push(hours$);
    // this.observerSub.push(worksites$);
    // this.observerSub.push(worktypes$)

    // this.authService.afAuth.authState.pipe(
    //   switchMap(auth => {
    //     if (!auth) {
    //       return of([]);
    //     }

    //     return this.dataService.fetchWorksitesByUID(auth.uid);
    //   })
    // ).subscribe(res => console.log('shwo ws', res));

    this.observerSub.push(authStateChange$);
  }

  signout() {
    // this.wsStore.clearWorksites();
    this.authService.signout();
  }

  ngOnDestroy(): void {
    this.observerSub.forEach(el => el.unsubscribe());
    this.authService.authSubscription?.unsubscribe();
  }
}
