import { Injectable } from '@angular/core';
import { Firestore, Query } from '@angular/fire/firestore';
import { collection, query, where, getDocs } from '@firebase/firestore';
import { from, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { DatabaseCollection } from '../utils/enums/db.enum';
import { Worksite } from '../utils/models/worksite.interface';
import { DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { Hour } from '../utils/models/hours.interface';

@Injectable({ providedIn: 'root' })
export class DataService {

    constructor(
        private firestore: Firestore,
    ) { }

    // /**
    //  * fetch worksites by user uid
    //  * @param uid unique id string
    //  * @returns Observable<Worksite[]>
    //  */
    // fetchWorksitesByUID(uid: string) {
    //     const collectionRef = collection(this.firestore, DatabaseCollection.WORKSITES);

    //     const collectionQuery = query(
    //         collectionRef,
    //         where('clientId', '==', 'jg22s'),
    //         where("users", "array-contains", uid)
    //     );

    //     return this.getWorksiteCollection(collectionQuery);
    // }

    // fetchWorksitesByClient(clientID: string) {
    //     const collectionRef = collection(this.firestore, DatabaseCollection.WORKSITES);

    //     const collectionQuery = query(
    //         collectionRef,
    //         where('clientId', '==', clientID),
    //     );
    //     return this.getWorksiteCollection(collectionQuery);
    // }

    // private getWorksiteCollection(collectionQuery: Query<DocumentData>) {
    //     return from(getDocs(collectionQuery)).pipe(
    //         shareReplay(),
    //         distinctUntilChanged(),
    //         debounceTime(30),
    //         map(res => {
    //             return this.mapSnapToWorksite(res);
    //         }));;
    // }

    // private mapSnapToWorksite(snaps: QuerySnapshot<DocumentData>) {
    //     const worksites: Worksite[] = [];
    //     snaps.forEach((doc: DocumentData) => {
    //         const id = doc.id;
    //         const data = doc.data();
    //         const worksite = {
    //             id,
    //             ...(data as object)
    //         } as Worksite;
    //         worksites.push(worksite);
    //     });

    //     return worksites;
    // }

    fetchHoursByUID(uid: string) {
        if (!uid) {
            return of([]);
        }
        const collectionRef = collection(this.firestore, DatabaseCollection.HOURS);

        const collectionQuery = query(
            collectionRef,
            where('clientId', '==', 'jg22s'),
            where("userId", "==", uid)
        );
        return this.getHourCollection(collectionQuery);
    }

    fetchHoursByClient(clientID: string) {
        const collectionRef = collection(this.firestore, DatabaseCollection.HOURS);

        const collectionQuery = query(
            collectionRef,
            where('clientId', '==', clientID),
        );
        return this.getHourCollection(collectionQuery);
    }

    private getHourCollection(collectionQuery: Query<DocumentData>) {
        return from(getDocs(collectionQuery)).pipe(
            shareReplay(),
            distinctUntilChanged(),
            debounceTime(30),
            map(res => {
                return this.mapSnapToHours(res);
            }));;
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
