import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Hour } from '../utils/models/hours.interface';
import { Worksite } from '../utils/models/worksite.interface';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

interface WsMarked {
    wsId: string;
    marked: number;
}

@Injectable({ providedIn: 'root' })
export class WorksiteStoreService {

    private worksitesSubj = new BehaviorSubject<Worksite[]>([]);
    worksites$ = this.worksitesSubj.asObservable();

    constructor(
        private dataService: DataService,
        private authService: AuthService
    ) { }

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

    // /**
    //  * select store worksites
    //  * @param uid user uid
    //  * @returns Observable<Worksite[]>
    //  */
    selectWorksitesByUID(uid: string) {
        return this.worksites$.pipe(
            map((res: Worksite[]) => {
                return res.filter(el => el.users.includes(uid))
            })
        )
    }

    /**
     * select worksite from store by worksite id
     * @param id worksiteID
     * @returns Observable<Worksite | null>
     */
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

    /**
     * uid from auth state changes in function.
     * fetch from backend or select from store if present.
     * select worksites by UID
     * @returns Observable<Worksite[]>
     */
    fetchOrStoreWorksitesByUID(): Observable<Worksite[]> {
        const worksites$ = this.authService.authState$.pipe(
            switchMap(auth => auth ? this.worksitesByUIDFetchOrStore(auth) : of([]))
        )
        return worksites$;
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
                    const mapped = wsMarked
                        .filter(els => els.wsId === el.id)
                        .map(el => el.marked)
                        .reduce((prev, cur) => prev + cur, 0);

                    const comp = {
                        ...el,
                        marked: mapped * 60
                    } as Worksite;
                    worksitesArr.push(comp);
                });
                return worksitesArr;
            })
        )
    }

    /**
     * Get Worksite[] data observable either from store if present or fetch data from database.
     * Side-effect: push data to store if fetch is used (no initial data in store)
     * @returns Observable Worksite[] 
     */
    private worksitesByUIDFetchOrStore(auth: firebase.default.User) {
        if (!auth) {
            return of([]);
        }

        return this.selectWorksitesByUID(auth.uid).pipe(
            switchMap((ws: Worksite[]) => {
                return ws.length ? of(ws) : this.dataService.fetchWorksitesByUID(auth.uid).pipe(
                    tap(res => {
                        if (res.length) {
                            this.storeWorksitesPush(res);
                        }
                    })
                )
            }),
        )
    }

}   
