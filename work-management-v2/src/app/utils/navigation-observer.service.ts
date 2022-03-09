import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { resetActive, setActiveValue } from './functions';
import { NavItems, NavMapping } from './interfaces/navigation-items.interface';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ListItems } from './enums/navigation.enum';

@Injectable({ providedIn: 'root' })
export class NavigationObserverService implements OnDestroy {
  navItems: NavItems = {
    li1: false,
    li2: false,
    li3: false,
    li4: false,
    li5: false,
  };

  navMapping: NavMapping = {
    selected: ListItems.ITEM1,
    list: ListItems.ITEM2,
  };

  observerSub: Subscription | undefined;

  constructor(private router: Router) {}

  observeNavigation() {
    this.observerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const urlName = this.filterUrl(event);
        this.mapNavAndSetActive(urlName);
      });
  }

  filterUrl(event: object) {
    const urlNameS1 = event
      .toString()
      .split(',')
      .filter((el) => el.includes('urlAfterRedirects: '))[0];

    const urlName = urlNameS1.substring(
      urlNameS1.indexOf('/') + 1,
      urlNameS1.length - 2
    );
    return urlName;
  }

  private mapNavAndSetActive(urlName: string) {
    const obj = this.navMapping;
    let k: keyof typeof obj;
    for (k in obj) {
      if (urlName === k) {
        resetActive(this.navItems);
        setActiveValue(this.navItems, this.navMapping[k]);
      }
    }
  }

  ngOnDestroy(): void {
    this.observerSub?.unsubscribe();
  }
}
