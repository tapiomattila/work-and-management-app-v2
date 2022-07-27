import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Worktype } from './worktype.model';
import { WorktypeService } from './worktype.service';
import { WorktypeState, WorktypeStore } from './worktype.store';

@Injectable({ providedIn: 'root' })
export class WorktypeQuery extends QueryEntity<WorktypeState> {
    constructor(
        private worktypeService: WorktypeService,
        protected store: WorktypeStore,
    ) {
        super(store);
    }

    // /**
    //  * select store worktypes
    //  * @param uid user uid
    //  * @returns Observable<Worktype[]>
    //  */
    selectWorktypesByUID(uid: string) {
        return this.selectAll({
            filterBy: [
                entity => entity.updatedBy === uid,
            ]
        })
    }

    /**
     * uid from auth state changes in function.
     * fetch from backend or select from store if present.
     * select worktypes by UID
     * @returns Observable<Worktype[]>
     */
     selectFetchOrStore(uid: string) {
        if (!uid) {
            return of([]);
        }
        return this.selectWorktypesByUID(uid).pipe(
            switchMap((ws: Worktype[]) => {
                return ws.length ? of(ws) : this.worktypeService.fetchWorktypesByUID(uid).pipe(
                    tap(res => this.worktypeService.setWorktypes(res))
                )
            }),
        )
    }
}
