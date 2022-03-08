import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-worksite-info-card',
  templateUrl: './worksite-info-card.component.html',
  styleUrls: ['./worksite-info-card.component.scss'],
})
export class WorksiteInfoCardComponent implements OnInit {
  @Input() title: string | undefined;
  @Input() address: string | undefined;
  @Input() totalHours: number | undefined;

  constructor() {}

  ngOnInit(): void {}
}
