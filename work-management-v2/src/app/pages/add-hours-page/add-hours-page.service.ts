import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, filter, map, Observable, of, shareReplay, Subscription, switchMap, tap } from 'rxjs';
import * as moment from 'moment';
import { Worksite } from 'src/app/state/worksites/worksite.model';
import { filterToDayElement, formatHoursTotal } from 'src/app/utils/functions';
import { HourQuery } from 'src/app/state/hours/hour.query';
import { Router } from '@angular/router';
import { WorksiteQuery } from 'src/app/state/worksites/worksite.query';
import { WorktypeQuery } from 'src/app/state/worktypes/worktype.query';
import { Worktype } from 'src/app/state/worktypes/worktype.model';
import { SessionQuery } from 'src/app/state/session/session.query';
import { Hour } from 'src/app/state/hours/hour.model';
import { HourService } from 'src/app/state/hours/hour.service';

interface FormAddHour {
    date: FormControl<Date | null>;
    worksite: FormControl<string | null>;
    worktype: FormControl<string | null>;
    slider: FormControl<number | null>;
}

@Injectable({ providedIn: 'root' })
export class AddHoursPageService {
    subs: Subscription | undefined;

    constructor(
        private hourQuery: HourQuery,
        private hourService: HourService,
        private worksiteQuery: WorksiteQuery,
        private worktypeQuery: WorktypeQuery,
        private sessionQuery: SessionQuery
    ) { }

    getUID() {
        return this.sessionQuery.uid$.pipe(
            filter((el) => el !== ''),
            shareReplay()
        );
    }

    ///////////////////////
    // date input
    // date selection
    getInputDateData(date: FormControl) {
        return this.getDateInputValueChange(date).pipe(
            map((res) => {
                if (!res) return '';
                const isoDate = this.getDate(res);
                const date = new Date(isoDate);
                return this.getDateInputFormat(date);
            })
        );
    }

    getDateInputValueChange(date: FormControl) {
        return date.valueChanges;
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

    getDateInputFormat(date: Date) {
        return moment(date).format('ddd, MMMM Do YYYY');
    }
    ///////////////////////

    ///////////////////////
    // day marked hours
    getCurrentDayTotalHoursValue(currentWorksite$: Observable<Worksite | null>, date: FormControl) {
        const dateValue$ = this.getDateInputValueChange(date).pipe(
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
            }),
            map((res) => (res ? res : '0h'))
        );
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
    ///////////////////////

    ///////////////////////
    // dropdown selection + slider value
    setWorksiteSelect(currentWorksite$: Observable<Worksite | null>, worksite: FormControl) {
        const setWsSelectSub = currentWorksite$.pipe(
            tap(ws => {
                if (ws) {
                    worksite.setValue(ws.id)
                }
            })
        ).subscribe();
        this.subs?.add(setWsSelectSub);
    }

    changeWorksiteBySelect(worksite: FormControl, router: Router) {
        const worksiteSelectSub = worksite.valueChanges.subscribe(res => {
            router.navigate(['add', res])
        });
        this.subs?.add(worksiteSelectSub);
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

    /**
     * 
     * @param uid$ session uid
     * @param worksites Worksite[]
     * @param worktypes Worsktype[]
     * 
     * Fills passed in arrays with worksite and worktype data --
     * !! Modifies input array data !!
     */
    fillDropdownData(uid$: Observable<string>, worksites: Worksite[], worktypes: Worktype[]) {
        const ws$ = this.getWorksites(uid$);
        const wt$ = this.getWorktypes(uid$);
        const combined$ = combineLatest([uid$, wt$, ws$]);

        const fillDropdownData = combined$.subscribe(
            (res: [string, Worktype[], Worksite[]]) => {
                const [uid, wt, ws] = res;
                // this.hoursForm.controls.worktype.setValue(wt[2].id);
                wt.forEach((el) => worktypes.push(el));
                ws.forEach((el) => worksites.push(el));
            }
        );
        this.subs?.add(fillDropdownData);
    }
    ///////////////////////

    ///////////////////////
    // marked hours list and selection toggle
    updateMarked(hour: Hour, form: FormGroup<FormAddHour>) {
        if (!hour?.id) return;

        if (!this.hourQuery.hasActive()) {
            this.clearActive(form);
            this.setActiveValues(hour, form);
            return;
        }

        if (this.hourQuery.getActiveId() === hour.id) {
            this.toggleActive(hour.id, form);
            return;
        }

        this.clearActive(form);
        this.setActiveValues(hour, form);
    }

    clearActive(form: FormGroup<FormAddHour>) {
        this.hourService.activeNull();
        form.controls.worksite.setValue('');
        form.controls.worktype.setValue('');
        form.controls.slider.setValue(0);
    }

    toggleActive(id: string, form: FormGroup<FormAddHour>) {
        this.hourService.toggleActive(id);
        form.controls.worksite.setValue('');
        form.controls.worktype.setValue('');
        form.controls.slider.setValue(0);
    }

    setActiveValues(hour: Hour, form: FormGroup<FormAddHour>) {
        if (!hour?.id) return;
        this.hourService.setActive(hour.id);
        form.controls.worksite.setValue(hour.worksiteId);
        form.controls.worktype.setValue(hour.worktypeId);
        form.controls.slider.setValue(hour.marked * 60);
    }

    getMarkedHoursList(currentWorksite$: Observable<Worksite | null>, form: FormGroup<FormAddHour>) {
        const dateValue$ = this.getDateInputValueChange(form.controls.date);
        const latest$ = combineLatest({
            date: dateValue$,
            currentWorksite: currentWorksite$,
        });

        return latest$.pipe(
            switchMap((values) => {
                const { date, currentWorksite: worksite } = values;
                if (worksite) {
                    return this.hourQuery.selectHoursByWorksite(worksite.id).pipe(
                        map((hours: Hour[]) => {
                            if (!date) return hours;
                            return hours.filter((el) => filterToDayElement(el, date));
                        })
                    );
                } else {
                    return of([]);
                }
            }),
        );
    }

    removeItem(hour: Hour) {
        // TODO: add loading to marked info for delete xhr event
        if (!hour?.id) return;
        const deleteSub = this.hourService.deleteDocument(hour.id).subscribe(() => {
            if (!hour?.id) return;
            this.hourService.removeFromStore(hour.id);
        })
        this.subs?.add(deleteSub);
    }
    ///////////////////////
}
