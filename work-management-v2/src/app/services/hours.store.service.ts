import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { compareToCurrentDate } from '../utils/functions';
import { Hour } from '../utils/models/hours.interface';

@Injectable({ providedIn: 'root' })
export class HoursStoreService {

    private hoursSubj = new BehaviorSubject<Hour[]>([]);
    hours$ = this.hoursSubj.asObservable();

    constructor() { }

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
     * select store worksites
     * @param uid user uid
     * @returns Observable<Worksite[]>
     */
    selectHoursByUID(uid: string) {
        console.log(
            'uid: ', uid
        );

        return of([]);
    }

    /**
     * all user hours
     * @param id 
     * @returns 
     */
    selectHoursByWorksiteID(id: string) {
        return this.hours$.pipe(
            map(els => els.filter(el => {
                return el.worksiteId === id
            })),
        )
    }

    /**
     * all user hours
     * @returns 
     */
    selectCurrentDayHours() {
        return this.hours$.pipe(
            map(elements => elements.filter(el => {
                return compareToCurrentDate(el.updatedAt.toString());
            }))
        );
    }

    /**
     * all user hours
     * @returns 
     */
    selectCurrentDayHoursByWorksite(id: string) {
        return this.hours$.pipe(
            map(elements => elements.filter(el => {
                return compareToCurrentDate(el.updatedAt.toString());
            })),
            map(hours => hours.filter(el => {
                if (el.worksiteId === id) {
                    return el;
                }
                return;
            })),
            map(hours => {
                return hours?.map(el => el.marked)
            }),
            map(el => el?.reduce((prev, cur) => prev + cur, 0)),
            map(total => total * 60)
        );
    }

    filterHoursByWorksite(hours: Hour[], worksiteID: string) {
        return hours.filter(els => els.worksiteId === worksiteID);
    }

    testFilter() {
        return this.hours$.pipe(
            map(els => els.filter(el => {
                return el.worksiteId === '9lkuBHzagpFDYoSNMdfQ'
            })),
        )
    }
}
