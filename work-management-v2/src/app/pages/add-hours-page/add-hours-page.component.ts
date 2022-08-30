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
import { MINUTESINHOUR } from 'src/app/utils/configs/app.config';
import { ROUTEPARAMS } from 'src/app/utils/enums/app.enum';
import { filterToCurrentDayElement, formatHoursTotal } from 'src/app/utils/functions';

@Component({
  selector: 'app-add-hours-page',
  templateUrl: './add-hours-page.component.html',
  styleUrls: ['./add-hours-page.component.scss'],
})
export class AddHoursPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private subs: Subscription | undefined;

  currentWorksite$: Observable<Worksite | null> | undefined;
  totalHours$: Observable<string | undefined> | undefined;
  hours$: Observable<Hour[] | undefined> | undefined;

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
  ) {}

  ngOnInit(): void {
    const routeWorksite$ = this.getRouteWorksite();
    const mostRecentWorksite$ = this.getMostRecent(routeWorksite$);
    this.currentWorksite$ = this.getCurrent(
      routeWorksite$,
      mostRecentWorksite$
    );
    this.dateInputAs$ = this.getInputDateData();
    const uid$ = this.getUID();
    this.totalHours$ = this.getCurrentDayTotalHoursValue(this.currentWorksite$);
    this.fillDropdownData(uid$);
    this.hours$ = this.getMarkedHoursList(this.currentWorksite$);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hoursForm.controls.date.setValue(new Date());
    }, 200);
  }

  formatLabel(value: number) {
    return value >= 1000 ? Math.round(value / 1000) + 'k' : value;
  }

  onSubmit(form: NgForm) {
    const { date, worksite, worktype, slider } = form.value;

    const marked = slider / MINUTESINHOUR;
    const modifyDate = this.getDate(date);
    const uid = this.sessionQuery.getValue().uid;

    const worksiteName =
      this.worksiteQuery.getWorksiteByID(worksite)?.name || '';
    const worktypeName =
      this.worktypeQuery.getWorktypeByID(worktype)?.name || '';

    const hour: Hour = {
      clientId: 'jg22s',
      createdAt: modifyDate,
      createdBy: uid,
      marked,
      updatedAt: modifyDate,
      updatedBy: uid,
      userId: uid,
      worksiteId: worksite,
      worksiteName,
      worktypeId: worktype,
      worktypeName,
    };

    this.hourService
      .addNewHour(hour)
      .pipe(tap((hour: Hour) => this.hourService.addHourToStore(hour)))
      .subscribe((res) => console.log('show res', res));
  }

  getRouteWorksite() {
    return this.route.params.pipe(
      switchMap((params: Params) => {
        return params[ROUTEPARAMS.WORKSITEID]
          ? this.worksiteQuery.selectWorksiteByID(
              params[ROUTEPARAMS.WORKSITEID]
            )
          : of(null);
      }),
      shareReplay()
    );
  }

  getMostRecent(routeWorksite$: Observable<Worksite | null>) {
    return routeWorksite$.pipe(
      switchMap((ws) =>
        ws
          ? of(null)
          : this.hourQuery.selectMostRecentHourWorksite(
              this.worksiteQuery.worksites$
            )
      )
    );
  }

  getCurrent(
    routeWorksite$: Observable<Worksite | null>,
    mostRecentWorksite$: Observable<Worksite | null>
  ) {
    return routeWorksite$.pipe(
      switchMap((ws) => (ws ? of(ws) : mostRecentWorksite$))
    );
  }

  getInputDateData() {
    return this.getDateInputValueChange().pipe(
      map((res) => {
        if (!res) return '';
        const isoDate = this.getDate(res);
        const date = new Date(isoDate);
        return this.getDateInputFormat(date);
      })
    );
  }

  getDateInputValueChange() {
    return this.hoursForm.controls.date.valueChanges;
  }

  getDateInputFormat(date: Date) {
    return moment(date).format('ddd, MMMM Do YYYY');
  }

  getUID() {
    return this.sessionQuery.uid$.pipe(
      filter((el) => el !== ''),
      shareReplay()
    );
  }

  getWorksites(uid$: Observable<string>) {
    return uid$.pipe(
      switchMap((uid) =>
        this.worksiteQuery
          .selectWorksitesByUID(uid)
          .pipe(filter((el) => el.length !== 0))
      )
    );
  }

  getWorktypes(uid$: Observable<string>) {
    return uid$.pipe(
      switchMap((uid) => this.worktypeQuery.selectWorktypesByUID(uid)),
      filter((el) => el.length !== 0)
    );
  }

  getWorksiteInfo(worksite: Worksite) {
    return `${worksite.info.streetAddress}, ${worksite.info.postalCode} ${worksite.info.city}`;
  }

  getDate(date: Date) {
    const isCurrentDay = (date as Date).getDate() === new Date().getDate();

    // date select takes day:00:00 local time (+3, in finland) so the UTC time is not right (-3, in finland) (wrong day)
    const correctDayUTC = isCurrentDay
      ? moment(new Date(date))
      : moment(new Date(date)).add(12, 'hour');
    const dateConvert = new Date(correctDayUTC.toISOString()).toUTCString();
    return new Date(dateConvert).toISOString();
  }

  filterDate(
    elements: { marked: number; date: string }[] | null,
    comparableISODate: string
  ) {
    return elements?.filter((el) => {
      const comparable = new Date(comparableISODate).getDate();
      const compareDate = new Date(el.date).getDate();
      return comparable === compareDate;
    });
  }

  mapTotalHoursNumber(
    elements: { marked: number; date: string }[] | undefined
  ) {
    return elements
      ?.map((el) => el.marked)
      .reduce((prev, cur) => prev + cur, 0);
  }

  getCurrentDayTotalHoursValue(currentWorksite$: Observable<Worksite | null>) {
    const dateValue$ = this.getDateInputValueChange().pipe(
      map((res) => {
        if (!res) return '';
        const isoDate = this.getDate(res);
        return new Date(isoDate);
      })
    );

    const totalHoursForDay$ = currentWorksite$.pipe(
      switchMap((ws) =>
        ws ? this.hourQuery.selectTotalHoursForDay(ws.id) : of(null)
      )
    );

    const latest$ = combineLatest({
      date: dateValue$,
      totalHours: totalHoursForDay$,
    });

    return latest$.pipe(
      map((res) => {
        const { totalHours, date } = res;
        if (!totalHours || !date) return '';
        const obj = this.filterDate(totalHours, date.toISOString());
        return this.mapTotalHoursNumber(obj);
      }),
      filter((el) => el !== undefined),
      map((total) => {
        if (!total) return;
        return formatHoursTotal(total);
      })
    );
  }

  fillDropdownData(uid$: Observable<string>) {
    const ws$ = this.getWorksites(uid$);
    const wt$ = this.getWorktypes(uid$);
    const combined$ = combineLatest([uid$, wt$, ws$]);

    const fillDropdownData = combined$.subscribe(
      (res: [string, Worktype[], Worksite[]]) => {
        const [uid, wt, ws] = res;
        this.hoursForm.controls.worksite.setValue(ws[0].id);
        this.hoursForm.controls.worktype.setValue(wt[2].id);
        wt.forEach((el) => this.worktypes.push(el));
        ws.forEach((el) => this.worksites.push(el));
      }
    );
    this.subs?.add(fillDropdownData);
  }

  getMarkedHoursList(currentWorksite$: Observable<Worksite | null>) {
    const dateValue$ = this.getDateInputValueChange();
    const latest$ = combineLatest({
      date: dateValue$,
      currentWorksite: currentWorksite$,
    });

    return latest$.pipe(
      switchMap(values => {
        const { date, currentWorksite: worksite } = values;
        return worksite ? this.hourQuery.selectHoursByWorksite(worksite.id) : of([])
      }),
      map((res) => {
        return res.filter((el) => filterToCurrentDayElement(el));
      }),
      tap(res => console.log('show res', res))
    );
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
}
