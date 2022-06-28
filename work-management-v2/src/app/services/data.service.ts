import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, query, where, getDocs } from '@firebase/firestore';
import { from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { DatabaseCollection } from '../utils/enums/db.enum';
import { Worksite } from '../utils/models/worksite.interface';
import { DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { WorksiteStoreService } from './worksite.store.service';
import { Hour } from '../utils/models/hours.interface';
import { HoursStoreService } from './hours.store.service';

@Injectable({ providedIn: 'root' })
export class DataService {

    constructor(
        private firestore: Firestore,
        private wsStore: WorksiteStoreService,
        private hoursStore: HoursStoreService
    ) { }

    /**
     * Get Worksite[] data observable either from store if present or fetch data from database.
     * Side-effect: push data to store if fetch is used (no initial data in store)
     * @returns Observable Worksite[] 
     */
    worksitesByUIDFetchOrStore(auth: firebase.default.User) {
        if (auth) {
            return this.wsStore.selectWorksitesByUID(auth.uid).pipe(
                switchMap((ws: Worksite[]) => {
                    if (ws.length === 0) {
                        return this.mapWorksitesByUID(auth).pipe(
                            tap(res => this.wsStore.storeWorksitesPush(res))
                        );
                    } else {
                        return of(ws);
                    }
                })
            )
        } else {
            return [];
        }
    }

    /**
 * map fetched worksites docs (by uid) to Worksite[]
 * @param auth firebase.default.User
 * @returns Worksite[]
 */
    mapWorksitesByUID(auth: firebase.default.User) {
        if (auth) {
            return this.fetchWorksitesByUID(auth.uid).pipe(
                map(res => {
                    return this.mapSnapToWorksite(res);
                }),
            );
        } else {
            return of([]);
        }
    }

    fetchWorksitesByUID(uid: string) {
        const collectionRef = collection(this.firestore, DatabaseCollection.WORKSITES);

        const collectionQuery = query(
            collectionRef,
            where("users", "array-contains", uid)
        );
        return from(getDocs(collectionQuery));
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

    /**
     * Get Hour[] data observable either from store if present or fetch data from database.
     * Side-effect: push data to store if fetch is used (no initial data in store)
     * @returns Observable Hour[] 
     */
    hoursByUIDFetchOrStore(auth: firebase.default.User) {
        if (auth) {
            return this.hoursStore.selectHoursByUID(auth.uid).pipe(
                switchMap((hours: Hour[]) => {
                    if (hours.length === 0) {
                        return this.mapHoursByUID(auth).pipe(
                            tap(res => this.hoursStore.storeHoursPush(res))
                        );
                    } else {
                        return of(hours);
                    }
                })
            )
        } else {
            return [];
        }
    }

    mapHoursByUID(auth: firebase.default.User) {
        if (auth) {
            return this.fetchHoursByUID(auth.uid).pipe(
                map(res => {
                    return this.mapSnapToHours(res);
                })
            );
        } else {
            return of([]);
        }
    }

    fetchHoursByUID(uid: string) {
        const collectionRef = collection(this.firestore, DatabaseCollection.HOURS);

        const collectionQuery = query(
            collectionRef,
            where("userId", "==", uid)
        );

        return from(getDocs(collectionQuery));
    }

    private mapSnapToHours(snaps: QuerySnapshot<DocumentData>) {
        const hours: Hour[] = [];
        snaps.forEach((doc: DocumentData) => {
            const id = doc.id;
            const data = doc.data();
            const hour = {
                id,
                ...data
            } as Hour;
            hours.push(hour);
        });

        return hours;
    }
}
