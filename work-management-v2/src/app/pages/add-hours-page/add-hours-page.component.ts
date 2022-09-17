import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';
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
import { AddHoursPageService } from './add-hours-page.service';

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

  dateInputAs$: Observable<string> | undefined;

  worksites: Worksite[] = [];
  worktypes: Worktype[] = [];

  hoursForm = new FormGroup({
    date: new FormControl(new Date(), [Validators.required]),
    worksite: new FormControl('', [Validators.required]),
    worktype: new FormControl('', [Validators.required]),
    slider: new FormControl(0, [Validators.required]),
  });

  constructor(
    private worksiteQuery: WorksiteQuery,
    private worktypeQuery: WorktypeQuery,
    private hourQuery: HourQuery,
    private sessionQuery: SessionQuery,
    private hourService: HourService,
    private route: ActivatedRoute,
    private router: Router,
    private addHoursService: AddHoursPageService
  ) { }

  ngOnInit(): void {
    const routeWorksite$ = this.getRouteWorksite();
    const mostRecentWorksite$ = this.getMostRecent(routeWorksite$);
    const uid$ = this.addHoursService.getUID();

    this.currentWorksite$ = this.getCurrent(
      routeWorksite$,
      mostRecentWorksite$
    );

    this.dateInputAs$ = this.addHoursService.getInputDateData(this.getFormControls.date);

    this.totalHours$ =
      this.addHoursService.getCurrentDayTotalHoursValue(this.currentWorksite$, this.getFormControls.date);
    this.hours$ = this.addHoursService.getMarkedHoursList(this.currentWorksite$, this.hoursForm);

    this.addHoursService.fillDropdownData(uid$, this.worksites, this.worktypes);
    this.addHoursService.setWorksiteSelect(this.currentWorksite$, this.getFormControls.worksite);
    this.addHoursService.changeWorksiteBySelect(this.getFormControls.worksite, this.router);

    this.hourService.activeNull();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.hoursForm.controls.date.setValue(new Date());
    }, 200);
  }

  get getFormControls() {
    return this.hoursForm.controls;
  }

  get activeHour() {
    return this.hourQuery.getActive();
  }

  get getButtonText() {
    return this.hourQuery.getActive() ? 'Update' : 'Add New';
  }

  get sliderValue() {
    return this.hoursForm.controls.slider.valueChanges;
  }

  onSubmit(form: FormGroup) {
    const hour = this.buildHour(form);
    const active = this.hourQuery.getActive() as Hour
    active?.id ? this.updateHour(hour, active.id) : this.addHour(hour);
  }

  updateHour(hour: Hour, id: string) {
    const updateSub = this.hourService.updateDocument(hour, id)
      .pipe(tap(() => this.hourService.updateHour(hour)))
      .subscribe();
    this.subs?.add(updateSub);
  }

  addHour(hour: Hour) {
    const addHoursSub = this.hourService
      .addNewHour(hour)
      .pipe(tap((hour: Hour) => this.hourService.addHourToStore(hour)))
      .subscribe();
    this.subs?.add(addHoursSub);
  }

  buildHour(form: FormGroup) {
    const { date, worksite, worktype, slider } = form.value;

    const marked = slider / MINUTESINHOUR;
    const modifyDate = this.addHoursService.getDate(date);
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
    return hour;
  }

  updateMarked(hour: Hour) {
    this.addHoursService.updateMarked(hour, this.hoursForm);
  }

  removeItem(hour: Hour) {
    this.addHoursService.removeItem(hour);
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
      switchMap(ws => ws ? of(ws) : mostRecentWorksite$)
    );
  }

  getWorksiteInfo(worksite: Worksite) {
    return `${worksite.info.streetAddress}, ${worksite.info.postalCode} ${worksite.info.city}`;
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
    this.addHoursService.subs?.unsubscribe();
  }
}
