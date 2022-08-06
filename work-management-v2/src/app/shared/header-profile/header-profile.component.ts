import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.scss'],
})
export class HeaderProfileComponent implements OnInit {
  @Input() name: string | null = '';
  @Input() date: string | undefined;
  @Input() photoUrl: string | null = '';

  constructor() {}

  ngOnInit(): void {}

  get getName() {
    return `Hello, ${this.name}`;
  }
}
