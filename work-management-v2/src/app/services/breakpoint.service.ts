import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BreakpointService {

    isHeader = false;
    over1200 = false;
    minw800 = `(min-width: 800px)`;

    constructor(
        public breakpointObserver: BreakpointObserver
    ) { }

    observeBreakpoint() {
        return this.breakpointObserver.observe([this.minw800])
    }
}