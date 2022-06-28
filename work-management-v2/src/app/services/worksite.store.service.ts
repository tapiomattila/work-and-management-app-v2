import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Hour } from '../utils/models/hours.interface';
import { Worksite } from '../utils/models/worksite.interface';

interface WsMarked {
    wsId: string;
    marked: number;
}

@Injectable({ providedIn: 'root' })
export class WorksiteStoreService {

    private worksitesSubj = new BehaviorSubject<Worksite[]>([]);
    worksites$ = this.worksitesSubj.asObservable();

    constructor() { }

    /**
     * Subject store worksites
     * @param worksites Worksite[]
     */
    storeWorksitesPush(worksites: Worksite[]) {
        const oldData = this.worksitesSubj.getValue();
        const newData = worksites;
        this.worksitesSubj.next(newData);
    }

    /**
     * Clear store worksites
     */
    clearWorksites() {
        this.worksitesSubj.next([]);
    }

    /**
     * select store worksites
     * @param uid user uid
     * @returns Observable<Worksite[]>
     */
    selectWorksitesByUID(uid: string) {
        return this.worksites$.pipe(
            map((res: Worksite[]) => {
                return res.filter(el => el.users.includes(uid))
            })
        )
    }

    selectWorksiteById(id: string) {
        return this.worksites$.pipe(
            map(els => {
                return els.filter(el => {
                    return el.id === id;
                })
            }),
            map(arr => arr.length > 0 ? arr[0] : null)
        )
    }

    mapHoursToWorksites(worksites: Worksite[], hours$: Observable<Hour[]>) {
        const wsMarked: WsMarked[] = [];
        const worksitesArr: Worksite[] = [];
        return hours$.pipe(
            tap(hours => {
                hours.forEach(el => {
                    const obj: WsMarked = {
                        wsId: el.worksiteId,
                        marked: el.marked
                    };
                    wsMarked.push(obj);
                })
            }),
            map(() => {
                worksites.forEach(el => {
                    const filtered = wsMarked.filter(els => els.wsId === el.id);
                    const mapped = filtered.map(el => el.marked);
                    const reduced = mapped.reduce((prev, cur) => prev + cur, 0);

                    const comp = {
                        ...el,
                        marked: reduced * 60
                    } as Worksite;
                    worksitesArr.push(comp);
                });
                return worksitesArr;
            })
        )
    }

}
