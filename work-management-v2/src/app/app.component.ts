import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ListItems, Routes } from './utils/enums/navigation.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router) {}

  getChange(event: string) {
    switch (event) {
      case ListItems.ITEM1:
        this.router.navigate([Routes.SELECTED]);
        break;
      case ListItems.ITEM2:
        this.router.navigate([Routes.LIST]);
        break;
      default:
        this.router.navigate([Routes.SELECTED]);
        break;
    }
  }
}
