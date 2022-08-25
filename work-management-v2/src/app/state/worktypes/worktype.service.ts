import { Injectable } from '@angular/core';
import { WorktypeStore } from './worktype.store';
import { getDocs, query, where } from '@angular/fire/firestore';
import { Firestore, Query } from '@angular/fire/firestore';
import { DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { DatabaseCollection } from 'src/app/utils/enums/app.enum';
import { from } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { createWorktype, Worktype } from './worktype.model';

@Injectable({ providedIn: 'root' })
export class WorktypeService {

    constructor(
        private store: WorktypeStore,
        private firestore: Firestore
    ) { }

    setWorktypes(worktypes: Partial<Worktype>[]) {
        const worktypeArray = new Array();
        worktypes.forEach(el => {
            worktypeArray.push(createWorktype(el));
        });
        this.store.set(worktypeArray);
    }

    clearWorksites() {
        this.store.reset();
    }

    /**
     * fetch worksites by user uid
     * @param uid unique id string
     * @returns Observable<Worksite[]>
     */
     fetchWorktypesByUID(uid: string) {
        const collectionRef = collection(this.firestore, DatabaseCollection.WORKTYPES);

        const collectionQuery = query(
            collectionRef,
            where('clientId', '==', 'jg22s'),
            where("updatedBy", "==", uid)
        );

        return this.getWorktypeCollection(collectionQuery);
    }

    private getWorktypeCollection(collectionQuery: Query<DocumentData>) {
        return from(getDocs(collectionQuery)).pipe(
            shareReplay(),
            distinctUntilChanged(),
            debounceTime(30),
            map(res => {
                return this.mapSnapToWorktype(res);
            }));;
    }

    private mapSnapToWorktype(snaps: QuerySnapshot<DocumentData>) {
        const worktypes: Worktype[] = [];
        snaps.forEach((doc: DocumentData) => {
            const id = doc['id'];
            const data = doc['data']();
            const worktype = {
                id,
                ...(data as object)
            } as Worktype;
            worktypes.push(worktype);
        });
        return worktypes;
    }
}
