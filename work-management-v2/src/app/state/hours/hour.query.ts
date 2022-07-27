import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { of } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
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
        return this.selectAll().pipe(
            map(els => els.filter(el => {
                return el.worksiteId === id
            })),
        )
    }

    /**
     * selectc current day hour by worksite id
     * @param id worksite id
     * @returns Observable<number>
     */
    selectCurrentDayHoursByWorksite(id: string) {
        return this.selectAll().pipe(
            map(elements => {
                return elements
                    // .filter(el => compareToCurrentDate(el.updatedAt.toString())
                    .filter(el => el.worksiteId === id
                    ).map(el => el.marked || 0
                    ).reduce((prev, cur) => prev + cur, 0)
            }),
            map(total => total * 60)
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
                return hours.length ? of(hours) : this.hourService.fetchHoursByUID(uid).pipe(
                    tap(res => this.hourService.setHours(res))
                )
            }),
        )
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

    /**
    * Select Hour[] data observable either from store if present or fetch data from database.
    * Side-effect: push data to store if fetch is used (no initial data in store)
    * @returns Observable Hour[] 
    */
    private hoursByUIDFetchOrStore(uid: string) {
        if (!uid) {
            return of([]);
        }
        return this.selectHoursByUID(uid).pipe(
            distinctUntilChanged(),
            switchMap((hours: Hour[]) => {
                if (hours.length > 0) {
                    return of(hours);
                }
                return this.hourService.fetchHoursByUID(uid).pipe(
                    tap(res => this.hourService.setHours(res)))
            })
        )
    }

}
