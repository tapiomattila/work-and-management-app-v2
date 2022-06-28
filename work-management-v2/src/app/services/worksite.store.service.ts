import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Worksite } from '../utils/models/worksite.interface';

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
}
