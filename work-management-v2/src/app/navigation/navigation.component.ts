import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { resetActive, setActiveValue } from '../utils/functions';
import { NavigationObserverService } from '../utils/navigation-observer.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  @Output() change = new EventEmitter();
  constructor(public navigationObs: NavigationObserverService) {}

  ngOnInit(): void {
    this.navigationObs.observeNavigation();
  }

  setActive(value: string) {
    resetActive(this.navigationObs.navItems);
    setActiveValue(this.navigationObs.navItems, value);
    this.change.emit(value);
  }
}
