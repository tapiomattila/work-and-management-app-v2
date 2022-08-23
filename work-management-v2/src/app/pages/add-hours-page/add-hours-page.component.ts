import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Hour } from 'src/app/state/hours/hour.model';
import { HourQuery } from 'src/app/state/hours/hour.query';
import { HourService } from 'src/app/state/hours/hour.service';
import { SessionQuery } from 'src/app/state/session/session.query';
import { Worksite } from 'src/app/state/worksites/worksite.model';
import { WorksiteQuery } from 'src/app/state/worksites/worksite.query';
import { Worktype } from 'src/app/state/worktypes/worktype.model';
import { WorktypeQuery } from 'src/app/state/worktypes/worktype.query';

@Component({
  selector: 'app-add-hours-page',
  templateUrl: './add-hours-page.component.html',
  styleUrls: ['./add-hours-page.component.scss']
})
export class AddHoursPageComponent implements OnInit, AfterViewInit, OnDestroy {

  private subs: Subscription | undefined;

  currentWorksite$: Observable<Worksite | null> | undefined;

  dateInput = new FormControl(new Date());
  dateInputAs$: Observable<string> | undefined;

  worksites: Worksite[] = [];
  worktypes: Worktype[] = [];

  hoursForm = new FormGroup({
    date: new FormControl(new Date(), [Validators.required]),
    worksite: new FormControl('', [Validators.required]),
    worktype: new FormControl('', [Validators.required]),
    slider: new FormControl(null, [Validators.required]),
  });

  constructor(
    private worksiteQuery: WorksiteQuery,
    private worktypeQuery: WorktypeQuery,
    private hourQuery: HourQuery,
    private sessionQuery: SessionQuery,
    private hourService: HourService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const routeWorksite$ = this.route.params.pipe(
      switchMap((params: Params) => {
        return params['worksiteId'] ? this.worksiteQuery.selectWorksiteByID(params['worksiteId']) : of(null);
      }),
    );

    const mostRecentWorksite$ = routeWorksite$.pipe(
      switchMap(res => {
        if (res) {
          return of(null);
        }
        return this.hourQuery.selectMostRecentHourWorksite(this.worksiteQuery.worksites$)
      })
    );

    this.currentWorksite$ = routeWorksite$.pipe(
      switchMap(res => {
        if (res) {
          return of(res)
        }
        return mostRecentWorksite$
      })
    );

    this.dateInputAs$ = this.hoursForm.controls.date.valueChanges.pipe(
      map((date: Date | null) => {
        return moment(date).format('ddd, MMMM Do YYYY')
      })
    )
    const dateSub = this.dateInputAs$.subscribe();

    const uid$ = this.sessionQuery.uid$.pipe(
      shareReplay(),
      filter(el => el !== '')
    );

    const ws$ = uid$.pipe(
      switchMap(uid => this.worksiteQuery.selectWorksitesByUID(uid).pipe(
        filter(el => el.length !== 0)
      ))
    );

    const wt$ = uid$.pipe(
      switchMap(uid => this.worktypeQuery.selectWorktypesByUID(uid)),
      filter(el => el.length !== 0)
    );

    const combined$ = combineLatest([
      uid$,
      wt$,
      ws$
    ]);

    combined$.subscribe((res: [string, Worktype[], Worksite[]]) => {
      const [uid, wt, ws] = res;
      wt.forEach(el => this.worktypes.push(el))
      ws.forEach(el => this.worksites.push(el))
    });

    this.subs?.add(dateSub);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hoursForm.controls.date.setValue(new Date());
    }, 200);
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  test() {
    console.log(this.hoursForm.value);
  }

  onButtonClick(form: NgForm) {
    const { date, worksite, worktype, slider } = form.value;
    const marked = slider / 60;

    const modifyDate = new Date(date).toISOString();
    const uid = this.sessionQuery.getValue().uid;

    const worksiteName = this.worksiteQuery.getWorksiteByID(worksite)?.name;
    const worktypeName = this.worktypeQuery.getWorktypeByID(worktype)?.name;

    const wsName = worksiteName ? worksiteName : '';
    const wtName = worktypeName ? worktypeName : '';

    const hour: Hour = {
      clientId: 'jg22s',
      createdAt: modifyDate,
      createdBy: uid,
      marked,
      updatedAt: modifyDate,
      updatedBy: uid,
      userId: uid,
      worksiteId: worksite,
      worksiteName: wsName,
      worktypeId: worktype,
      worktypeName: wtName
    };

    this.hourService.addNewHour(hour).pipe(
      tap((hour: Hour) => this.hourService.addHourToStore(hour))
    ).subscribe(res => console.log('show res', res));
  }

  getWorksiteInfo(worksite: Worksite) {
    return `${worksite.info.streetAddress}, ${worksite.info.postalCode} ${worksite.info.city}`;
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

}
