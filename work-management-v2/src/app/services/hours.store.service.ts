import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { compareToCurrentDate } from '../utils/functions';
import { Hour } from '../utils/models/hours.interface';

interface TestObj {
    [prop: string]: object[];
}

interface WsMarked22 {
    wsId: string;
    hour: Hour;
}

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

    mapHoursToWorksites(hours: Hour[]) {
        console.log('show hours', hours);

        const wsMarked: WsMarked22[] = [];
        hours.forEach(el => {
            const obj: WsMarked22 = {
                wsId: el.worksiteId,
                hour: el
            };
            wsMarked.push(obj);
        });

        const groupMarkedByWsID = wsMarked.reduce((group: TestObj, object) => {
            const { wsId } = object;
            console.log(object);
            console.log(wsId);
            group[wsId] = group[wsId] ?? [];
            console.log(group[wsId]);
            group[wsId].push(object);
            return group;
        }, {});

        return of([]);
    }

    testFilter() {
        return this.hours$.pipe(
            map(els => els.filter(el => {
                return el.worksiteId === '9lkuBHzagpFDYoSNMdfQ'
            })),
        )
    }
}
