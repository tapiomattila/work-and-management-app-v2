import { Injectable } from '@angular/core';
import { getDocs, query, where } from '@angular/fire/firestore';
import { Firestore, Query } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay, tap } from 'rxjs/operators';
import { DatabaseCollection } from 'src/app/utils/enums/db.enum';
import { createWorksite, Worksite } from './worksite.model';
import { WorksiteStore } from './worksite.store';
import { Hour } from '../hours/hour.model';

interface WsMarked {
    wsId: string;
    marked: number;
}

@Injectable({ providedIn: 'root' })
export class WorksiteService {

    constructor(
        private store: WorksiteStore,
        private firestore: Firestore,
    ) { }

    setWorksites(worksites: Partial<Worksite>[]) {
        const worksiteArray = new Array();
        worksites.forEach(el => {
            worksiteArray.push(createWorksite(el));
        });
        this.store.set(worksiteArray);
    }

    clearWorksites() {
        this.store.reset();
    }

    /**
     * Add hours by worksite for worksites
     * @param worksites Worksite[]
     * @param hours$ Observable<Hour[]>
     * @returns Observable<Worksite[]>
     */
    mapHoursToWorksites(worksites: Worksite[], hours$: Observable<Hour[]>) {
        const wsMarked: WsMarked[] = [];
        const worksitesArr: Worksite[] = [];
        const mappedHours$ = hours$.pipe(
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
        return mappedHours$;
        // return mappedHours$.pipe(
        //     map(res => res.filter(els => els.marked! > 0))
        // )
    }

    /**
     * fetch worksites by user uid
     * @param uid unique id string
     * @returns Observable<Worksite[]>
     */
    fetchWorksitesByUID(uid: string) {
        const collectionRef = collection(this.firestore, DatabaseCollection.WORKSITES);

        const collectionQuery = query(
            collectionRef,
            where('clientId', '==', 'jg22s'),
            where("users", "array-contains", uid)
        );

        return this.getWorksiteCollection(collectionQuery);
    }

    fetchWorksitesByClient(clientID: string) {
        const collectionRef = collection(this.firestore, DatabaseCollection.WORKSITES);

        const collectionQuery = query(
            collectionRef,
            where('clientId', '==', clientID),
        );
        return this.getWorksiteCollection(collectionQuery);
    }

    private getWorksiteCollection(collectionQuery: Query<DocumentData>) {
        return from(getDocs(collectionQuery)).pipe(
            shareReplay(),
            distinctUntilChanged(),
            debounceTime(30),
            map(res => {
                return this.mapSnapToWorksite(res);
            }));;
    }

    private mapSnapToWorksite(snaps: QuerySnapshot<DocumentData>) {
        const worksites: Worksite[] = [];
        snaps.forEach((doc: DocumentData) => {
            const id = doc.id;
            const data = doc.data();
            const worksite = {
                id,
                ...(data as object)
            } as Worksite;
            worksites.push(worksite);
        });
        return worksites;
    }
}
