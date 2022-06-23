import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { BreakpointService } from './services/breakpoint.service';
import { DataService } from './services/data.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './services/auth.service';
import { WorksiteStoreService } from './services/worksite.store.service';

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
   * - data service firebase connection ***
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

    const ws$ = this.wsStore.worksites$.subscribe(res => console.log('store: ', res));
    this.observerSub.push(ws$);

    const authStateChange$ = this.afAuth.authState.subscribe(() => this.getUserWorksites());
    this.observerSub.push(authStateChange$);
  }

  getUserWorksites() {
    this.wsStore.clearWorksites();
    const auth$ = this.afAuth.authState;
    const userWorksites$ = this.dataService.worksitesByUIDFetchOrStore(auth$);
    const pushToWorksiteStore$ = this.dataService.populateWorksiteStore(userWorksites$);
    const worksites$ = pushToWorksiteStore$.subscribe();
    this.observerSub.push(worksites$);
  }

  ngOnDestroy(): void {
    this.observerSub.forEach(el => el.unsubscribe());
    this.authService.authSubscription?.unsubscribe();
  }
}
