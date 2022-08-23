import { Injectable } from '@angular/core';
import { addDoc, doc, Firestore, getDoc, Query } from '@angular/fire/firestore';
import { collection, query, where, getDocs } from '@firebase/firestore';
import { DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { DocumentReference, DocumentSnapshot } from '@firebase/firestore';
import { from, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators';
import { DatabaseCollection } from 'src/app/utils/enums/db.enum';
import { createHour, Hour } from './hour.model';
import { HourStore } from './hour.store';

@Injectable({ providedIn: 'root' })
export class HourService {

    constructor(
        private store: HourStore,
        private firestore: Firestore,
    ) { }

    setHours(hours: Partial<Hour>[]) {
        const hoursArray = new Array();
        hours.forEach(el => {
            hoursArray.push(createHour(el));
        });
        this.store.set(hoursArray);
    }

    /**
     * Clear store worksites
     */
    clearWorksites() {
        this.store.reset();
    }

    addHourToStore(hour: Hour) {
        this.store.add(hour);
    }

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

    addNewHour(hour: Hour) {
        return from(addDoc(collection(this.firestore, DatabaseCollection.HOURS), hour)).pipe(
            map(res => {
                return this.mapDocRefToHour(res);
            }),
            switchMap(id => {
                const documentRef = doc(this.firestore, DatabaseCollection.HOURS, id);
                return from(getDoc(documentRef));
            }),
            map(hour => this.mapDocSnapToHour(hour))
        );
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

    private mapDocRefToHour(snap: DocumentReference<DocumentData>) {
        const id = snap.id;
        return id;
    }

    private mapDocSnapToHour(snap: DocumentSnapshot<DocumentData>) {
        const id = snap.id;
        const data = snap.data();
        const hour = {
            id,
            ...data
        } as Hour;
        return hour;
    }

    private mapSnapToHours(snaps: QuerySnapshot<DocumentData>) {
        const hours: Hour[] = [];
        snaps.forEach((doc: DocumentData) => {
            const id = doc['id'];
            const data = doc['data']();
            const hour = {
                id,
                ...data
            } as Hour;
            hours.push(hour);
        });

        return hours;
    }
}
