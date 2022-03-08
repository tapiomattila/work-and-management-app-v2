import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.scss'],
})
export class HeaderProfileComponent implements OnInit {
  @Input() name: string | undefined;
  @Input() date: string | undefined;

  constructor() {}

  ngOnInit(): void {}

  get getName() {
    return `Hello, ${this.name}`;
  }
}
