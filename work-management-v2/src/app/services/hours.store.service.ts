import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { compareToCurrentDate } from '../utils/functions';
import { Hour } from '../utils/models/hours.interface';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class HoursStoreService {

    private hoursSubj = new BehaviorSubject<Hour[]>([]);
    hours$ = this.hoursSubj.asObservable();

    constructor(
        private dataService: DataService,
        private authService: AuthService
    ) { }

    /**
     * Subject store hours
     * @param hours Hour[]
     */
    storeHoursPush(hours: Hour[]) {
        const oldData = this.hoursSubj.getValue();
        const newData = hours;
        this.hoursSubj.next(newData);
    }

    /**
     * Clear store worksites
     */
    clearWorksites() {
        this.hoursSubj.next([]);
    }

    /**
     * select hour from store by hour id
     * @param id hour id
     * @returns Observable<Hour | null>
     */
    selectHourByID(id: string) {
        return this.hours$.pipe(
            map(els => els.filter(el => el.id === id)),
            map(els => els.length ? els[0] : null)
        )
    }

    /**
     * select hours by worksite by worksite id
     * @param id worksite id
     * @returns Observable<Worksite[]>
     */
    selectHoursByWorksite(id: string) {
        return this.hours$.pipe(
            map(els => els.filter(el => {
                return el.worksiteId === id
            })),
        )
    }

    /**
     * select hours from store by user uid
     * @param uid user unique id
     * @returns Observable<Hour[]>
     */
    selectHoursByUID(uid: string) {
        return this.hours$.pipe(
            map(hours => hours.filter(el => {
                if (el.userId === uid) {
                    return el;
                }
                return;
            }))
        )
    }

    /**
     * uid from auth state changes in function.
     * fetch from backend or select from store if present.
     * select hours by UID
     * @returns Observable<Hour[]>
     */
    fetchOrStoreHoursByUID() {
        return this.authService.authState$.pipe(
            switchMap(auth => auth ? this.hoursByUIDFetchOrStore(auth) : of([]))
        )
    }

    /**
     * select current day hours from store
     * @returns Observable<Hour[]>
     */
    selectCurrentDayHours() {
        return this.hours$.pipe(
            map(elements => elements.filter(el => {
                return compareToCurrentDate(el.updatedAt.toString());
            }))
        );
    }

    /**
     * selectc current day hour by worksite id
     * @param id worksite id
     * @returns Observable<number>
     */
    selectCurrentDayHoursByWorksite(id: string) {
        return this.hours$.pipe(
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
     * filter input hours by input worksite id
     * @param hours Hour[]
     * @param worksiteID id string
     * @returns Hour[]
     */
    filterHoursByWorksite(hours: Hour[], worksiteID: string) {
        return hours.filter(els => els.worksiteId === worksiteID);
    }

    /**
    * Get Hour[] data observable either from store if present or fetch data from database.
    * Side-effect: push data to store if fetch is used (no initial data in store)
    * @returns Observable Hour[] 
    */
    private hoursByUIDFetchOrStore(auth: firebase.default.User) {
        if (!auth) {
            return of([]);
        }
        return this.selectHoursByUID(auth.uid).pipe(
            distinctUntilChanged(),
            switchMap((hours: Hour[]) => {
                if (hours.length > 0) {
                    return of(hours);
                }
                return this.dataService.fetchHoursByUID(auth.uid).pipe(
                    tap(res => this.storeHoursPush(res))
                );
            })
        )
    }
}
