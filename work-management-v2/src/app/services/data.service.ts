import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, query, where, getDocs } from '@firebase/firestore';
import { Observable, of } from 'rxjs';
import { map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { DatabaseCollection } from '../utils/enums/db.enum';
import { Worksite } from '../utils/models/worksite.interface';
import { DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { WorksiteStoreService } from './worksite.store.service';

@Injectable({ providedIn: 'root' })
export class DataService {

    constructor(
        private firestore: Firestore,
        private wsStore: WorksiteStoreService
    ) { }

    /**
     * Fetch Worksite[] data from database
     * @returns Observable Worksite[]
     */
    fetchWorksites() {
        const worksitesData = collection(this.firestore, DatabaseCollection.WORKSITES);
        return collectionData(worksitesData).pipe(
            map(res => res as Worksite[]),
        );
    }

    /**
     * 
     * @returns 
     */
    worksitesPopulateStore() {
        return this.fetchWorksites().pipe(
            tap(res => {
                this.wsStore.storeWorksitesPush(res);
            }),
        );
    }

    /**
     * Get Worksite[] data observable either from store if present or fetch data from database.
     * @returns Observable Worksite[] 
     */
    getWorksitesStoreOrFetch(): Observable<Worksite[]> {
        return this.wsStore.worksites$.pipe(
            switchMap(res => {
                return res.length === 0 ? this.worksitesPopulateStore() : this.wsStore.worksites$;
            })
        )
    }

    /**
     * map fetched worksites docs (by uid) to Worksite[]
     * @param auth$ Observable<any>
     * @returns Observable<Worksite[]>
     */
    mapWorksitesByUID(auth$: Observable<any>) {
        return auth$.pipe(
            switchMap(auth => {
                if (auth) {
                    return this.fetchWorksitesByUID(auth.uid);
                } else {
                    return [];
                }
            }),
            map(res => {
                return this.mapSnapToWorksite(res);
            })
        )
    }

    worksitesByUIDFetchOrStore(auth$: Observable<any>) {
        return auth$.pipe(
            switchMap(auth => {
                if (auth) {
                    return this.wsStore.selectWorksitesByUID(auth.uid);
                } else {
                    return [];
                }
            }),
            switchMap((ws: Worksite[]) => {
                if (ws.length === 0) {
                    return this.mapWorksitesByUID(auth$);
                } else {
                    return of(ws);
                }
            }),
        )
    }

    populateWorksiteStore(worksites$: Observable<Worksite[]>) {
        return worksites$.pipe(
            take(1),
            shareReplay(),
            tap(res => this.wsStore.storeWorksitesPush(res))
        )
    }

    async fetchWorksitesByUID(uid: string) {
        const collectionRef = collection(this.firestore, DatabaseCollection.WORKSITES);

        const collectionQuery = query(
            collectionRef,
            where("users", "array-contains", uid)
        );

        return await getDocs(collectionQuery);
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
