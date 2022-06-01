import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { BreakpointService } from './services/breakpoint.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  observerSub: Subscription[] = [];

  constructor(
    public bpService: BreakpointService
  ) { }

  ngOnInit(): void {
    const break800$ = this.bpService.observeBreakpoint().subscribe((state: BreakpointState) => {
      state.matches && !this.bpService.over1200 ? this.bpService.isHeader = false : this.bpService.isHeader = true;
    });
    this.observerSub.push(break800$);
  }

  ngOnDestroy(): void {
    this.observerSub.forEach(el => el.unsubscribe());
  }
}
