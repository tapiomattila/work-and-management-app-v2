import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  @Input() date: string | null = '';
  @Input() user: string | null = '';
  @Input() isHeader = false;
  @Input() photoUrl: string | null = '';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onNavigate(url: string) {
    this.router.navigate([url]);
  }

  get getName() {
    return `Hello ${this.user}`;
  }

}
