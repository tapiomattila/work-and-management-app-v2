import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable, of } from 'rxjs';
import { debounceTime, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { compareToCurrentDate, hoursReduce, mostRecentWorksiteByHour } from 'src/app/utils/functions';
import { Worksite } from '../worksites/worksite.model';
import { Hour } from './hour.model';
import { HourService } from './hour.service';
import { HourState, HourStore } from './hour.store';

@Injectable({ providedIn: 'root' })
export class HourQuery extends QueryEntity<HourState> {

    constructor(
        private hourService: HourService,
        protected store: HourStore,
    ) {
        super(store);
    }

    /**
     * select hour from store by hour id
     * @param id hour id
     * @returns Observable<Hour | null>
     */
    selectHourByID(id: string) {
        return this.selectAll({
            filterBy: [
                entity => entity.id === id
            ]
        });
    }

    /**
     * select store hours
     * @param uid user uid
     * @returns Observable<Hour[]>
     */
    selectHoursByUID(uid: string) {
        return this.selectAll({
            filterBy: [
                entity => entity.userId === uid
            ]
        })
    }

    /**
     * select hours by worksite by worksite id
     * @param id worksite id
     * @returns Observable<Worksite[]>
     */
    selectHoursByWorksite(id: string) {
        return this.selectAll({
            filterBy: [
                entity => entity.worksiteId === id
            ]
        })
    }

    /**
     * selectc current day hour by worksite id
     * @param id worksite id
     * @returns Observable<number>
     */
    selectCurrentDayHoursByWorksite(id: string) {
        return this.selectAll({
            filterBy: [
                entity => entity.worksiteId === id,
            ]
        }).pipe(
            map(elements => {
                return elements.filter(el => compareToCurrentDate(el.updatedAt.toString()))
                    .map(el => el.marked || 0)
                    .reduce((prev, cur) => prev + cur, 0)
            }),
            map(hour => hour * 60)
        );
    }

    /**
     * uid from auth state changes in function.
     * fetch from backend or select from store if present.
     * select worksites by UID
     * @returns Observable<Worksite[]>
     */
    selectFetchOrStore(uid: string) {
        if (!uid) {
            return of([]);
        }
        return this.selectHoursByUID(uid).pipe(
            switchMap((hours: Hour[]) => {
                return hours.length > 0 ? of(hours) : this.hourService.fetchHoursByUID(uid).pipe(
                    debounceTime(500),
                    tap(hours => {
                        if (hours.length > 0) {
                            this.hourService.setHours(hours);
                        }
                    }),
                    debounceTime(300),
                    shareReplay()
                )
            }),
        )
    }

    /**
     * Select most recent worksite by hours added
     * @param worksites$ Observable<Worksite[]>
     * @returns Observable<Worksite | null>
     */
    selectMostRecentHourWorksite(worksites$: Observable<Worksite[]>) {
        return this.selectAll().pipe(
            map((hours: Hour[]) => mostRecentWorksiteByHour(hours)),
            switchMap((hour: Hour) => {
                if (!hour) return [];

                return worksites$.pipe(
                    map(els => {
                        return els.filter(el => el.id === hour.worksiteId);
                    }),
                    map(ws => ws ? ws[0] : null)
                )
            }),
        )
    }

    /**
     * Select total hours for selected worksite observable
     * @param worksite$ Observable<Worksite[]>
     * @returns Observable<number | undefined>
     */
    totalHours(worksite$: Observable<Worksite | null>) {
        return worksite$.pipe(
            switchMap(res => {
                if (!res) return of(res);

                return this.selectAll({
                    filterBy: [
                        entity => entity.worksiteId === res.id
                    ]
                });
            }),
            map(hours => {
                if (!hours) return;
                return hoursReduce(hours);
            })
        );
    }

    /**
     * Select total hours for current day for selected worksite observable
     * @param worksite$ Observable<Worksite | null>
     * @returns Observable<number | undefined>
     */
    totalHoursForDay(worksite$: Observable<Worksite | null>) {
        return worksite$.pipe(
            switchMap(ws => {
                if (!ws) return of(undefined);
                return this.selectCurrentDayHoursByWorksite(ws.id);
            })
        );
    }

    /**
     * filter input hours by input worksite id
     * @param hours Hour[]
     * @param worksiteID id string
     * @returns Hour[]
     */
    filterHoursByWorksite(hours: Hour[], worksiteID: string) {
        return hours.filter(els => els.worksiteId === worksiteID);
    }
}
