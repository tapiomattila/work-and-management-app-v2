import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorktypeStoreService } from 'src/app/services/worktype.store.service';

interface Food {
  value: string;
  viewValue: string;
}

interface Car {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-hours-page',
  templateUrl: './add-hours-page.component.html',
  styleUrls: ['./add-hours-page.component.scss']
})
export class AddHoursPageComponent implements OnInit, AfterViewInit {

  dateInput = new FormControl(new Date());
  dateInputAs$: Observable<string> | undefined;

  selectedValue: string | undefined;
  selectedCar: string | undefined;

  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  cars: Car[] = [
    { value: 'volvo', viewValue: 'Volvo' },
    { value: 'saab', viewValue: 'Saab' },
    { value: 'mercedes', viewValue: 'Mercedes' },
  ];

  constructor(
    private wt: WorktypeStoreService
  ) { }

  ngOnInit(): void {
    this.dateInputAs$ = this.dateInput.valueChanges.pipe(
      map((date: Date) => {
        return moment(date).format('ddd, MMMM Do YYYY')
      })
    )
    this.dateInputAs$.subscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dateInput.setValue(new Date());
    }, 0);
  }

}
