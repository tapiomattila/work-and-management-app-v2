import { Component, EventEmitter, Output } from '@angular/core';

interface NavItems {
  li1: boolean;
  li2: boolean;
  li3: boolean;
  li4: boolean;
  li5: boolean;
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  @Output() change = new EventEmitter();

  navItems: NavItems = {
    li1: true,
    li2: false,
    li3: false,
    li4: false,
    li5: false,
  };

  constructor() {}

  setActive(value: string) {
    this.resetActive(this.navItems);
    this.setActiveValue(this.navItems, value);
    this.change.emit(value);
  }

  resetActive(navItems: NavItems) {
    const obj = navItems;
    let k: keyof typeof obj;
    for (k in obj) {
      obj[k] = false;
    }
  }

  setActiveValue(navItems: NavItems, inputValue: string) {
    const obj = navItems;
    let k: keyof typeof obj;
    for (k in obj) {
      if (k === inputValue) {
        obj[k] = true;
      }
    }
  }
}
