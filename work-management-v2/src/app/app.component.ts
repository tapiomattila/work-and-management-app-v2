import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointState } from '@angular/cdk/layout';
import { BreakpointService } from './services/breakpoint.service';
import { SessionService } from './state/session/session.service';
import { WorksiteQuery } from './state/worksites/worksite.query';
import { SessionQuery } from './state/session/session.query';
import { of, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { WorksiteService } from './state/worksites/worksite.service';
import { HourQuery } from './state/hours/hour.query';
import { WorktypeService } from './state/worktypes/worktype.service';
import { WorktypeQuery } from './state/worktypes/worktype.query';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  observerSub: Subscription[] = [];
  subs: Subscription[] = [];

  constructor(
    private hoursQuery: HourQuery,
    private sessionQuery: SessionQuery,
    private worksiteQuery: WorksiteQuery,
    private worktypeQuery: WorktypeQuery,
    private worktypeService: WorktypeService,
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

    const ws$ = this.sessionQuery.uid$.pipe(
      switchMap(uid => of(uid)),
      switchMap(uid => {
        return uid ? this.worksiteQuery.selectFetchOrStore(uid) : of([]);
      })
    ).subscribe()

    const hours$ = this.sessionQuery.uid$.pipe(filter(el => el !== '')).pipe(
      switchMap(uid => this.hoursQuery.selectFetchOrStore(uid))
    ).subscribe();

    const worktypes$ = this.sessionQuery.uid$.pipe(filter(el => el !== '')).pipe(
      switchMap(uid => this.worktypeQuery.selectFetchOrStore(uid))
    ).subscribe(res => console.log('worktype res', res));

    this.subs.push(session$);
    this.subs.push(ws$);
    this.subs.push(hours$);
    this.subs.push(worktypes$);
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
