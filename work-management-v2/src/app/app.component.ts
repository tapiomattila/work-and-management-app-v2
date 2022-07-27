import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointState } from '@angular/cdk/layout';
import { BreakpointService } from './services/breakpoint.service';
import { HoursStoreService } from './services/hours.store.service';
import { SessionService } from './state/session/session.service';
import { WorksiteQuery } from './state/worksites/worksite.query';
import { SessionQuery } from './state/session/session.query';
import { of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { WorksiteService } from './state/worksites/worksite.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  observerSub: Subscription[] = [];
  subs: Subscription[] = [];

  constructor(
    private hoursStore: HoursStoreService,
    private sessionService: SessionService,
    private sessionQuery: SessionQuery,
    private worksiteQuery: WorksiteQuery,
    private wsService: WorksiteService,
    public bpService: BreakpointService,
  ) { }

  ngOnInit(): void {
    const break800$ = this.bpService.observeBreakpoint().subscribe((state: BreakpointState) => {
      state.matches && !this.bpService.over1200 ? this.bpService.isHeader = false : this.bpService.isHeader = true;
    });
    this.observerSub.push(break800$);

    const session$ = this.sessionService.setAuthState().subscribe(res => console.log('set session state', res));

    const ws$ = this.sessionQuery.uid$.pipe(
      switchMap(uid => of(uid)),
      switchMap(uid => {
        return uid ? this.worksiteQuery.selectFetchOrStore(uid) : of([]);
      })
    ).subscribe()
    const hours$ = this.hoursStore.fetchOrStoreHoursByUID().subscribe();

    this.subs.push(session$);
    this.subs.push(ws$);
    this.subs.push(hours$);
  }

  signout() {
    // this.wsStore.clearWorksites();
    this.wsService.clearWorksites();
    this.sessionService.signout();
  }

  ngOnDestroy(): void {
    this.observerSub.forEach(el => el.unsubscribe());
    this.subs.forEach(el => el.unsubscribe());
  }
}
