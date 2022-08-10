import { Component, OnDestroy, OnInit } from '@angular/core';

import * as moment from 'moment';

import { BreakpointState } from '@angular/cdk/layout';
import { BreakpointService } from './services/breakpoint.service';
import { SessionService } from './state/session/session.service';
import { WorksiteQuery } from './state/worksites/worksite.query';
import { SessionQuery } from './state/session/session.query';
import { Observable, of, Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { WorksiteService } from './state/worksites/worksite.service';
import { HourQuery } from './state/hours/hour.query';
import { WorktypeQuery } from './state/worktypes/worktype.query';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  observerSub: Subscription[] = [];
  subs: Subscription[] = [];

  user$: Observable<string> | undefined;
  photo$: Observable<string> | undefined;

  constructor(
    private hoursQuery: HourQuery,
    private sessionQuery: SessionQuery,
    private worksiteQuery: WorksiteQuery,
    private worktypeQuery: WorktypeQuery,
    private sessionService: SessionService,
    private wsService: WorksiteService,
    public bpService: BreakpointService,
  ) { }

  ngOnInit(): void {
    const break800$ = this.bpService.observeBreakpoint().subscribe((state: BreakpointState) => {
      state.matches && !this.bpService.over1200 ? this.bpService.isHeader = false : this.bpService.isHeader = true;
    });
    this.observerSub.push(break800$);

    const session$ = this.sessionService.setAuthState().subscribe();

    const worksites$ = this.sessionQuery.uid$.pipe(
      switchMap(uid => of(uid)),
      switchMap(uid => {
        return uid ? this.worksiteQuery.selectFetchOrStore(uid) : of([]);
      })
    ).subscribe()

    const hours$ = this.sessionQuery.uid$.pipe(filter(el => el !== '')).pipe(
      switchMap(uid => uid ? this.hoursQuery.selectFetchOrStore(uid) : of([]))
    ).subscribe();

    const worktypes$ = this.sessionQuery.uid$.pipe(filter(el => el !== '')).pipe(
      switchMap(uid => this.worktypeQuery.selectFetchOrStore(uid))
    ).subscribe();

    this.user$ = this.sessionQuery.allState$.pipe(
      map(el => el.displayName),
      map(name => name ? name.split(' ')[0] : '')
    );

    this.photo$ = this.sessionQuery.allState$.pipe(
      map(el => el.photoUrl),
    )

    this.subs.push(session$);
    this.subs.push(worksites$);
    this.subs.push(hours$);
    this.subs.push(worktypes$);
  }

  getDate() {
    return moment(new Date()).format('ddd, MMMM Do YYYY')
  }

  signout() {
    this.wsService.clearWorksites();
    this.sessionService.signout();
  }

  ngOnDestroy(): void {
    this.observerSub.forEach(el => el.unsubscribe());
    this.subs.forEach(el => el.unsubscribe());
  }
}
