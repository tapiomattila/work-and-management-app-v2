import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-back-btn',
  templateUrl: './back-btn.component.html',
  styleUrls: ['./back-btn.component.scss'],
})
export class BackBtnComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit(): void {}

  back() {
    this.location.back();
  }
}
