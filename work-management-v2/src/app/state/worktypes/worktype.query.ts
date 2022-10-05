import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { combineLatest, of } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Worktype } from './worktype.model';
import { WorktypeService } from './worktype.service';
import { WorktypeState, WorktypeStore } from './worktype.store';

@Injectable({ providedIn: 'root' })
export class WorktypeQuery extends QueryEntity<WorktypeState> {
    constructor(
        private worktypeService: WorktypeService,
        protected override store: WorktypeStore,
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
     * Select worktype from store by its id
     * @param id worktype id
     * @returns Observable<Worktype | null>
     */
    selectWorktypeByID(id: string) {
        return this.selectAll({
            filterBy: [
                entity => entity.id === id,
            ]
        }).pipe(
            map(els => els ? els[0] : null)
        );
    }

    getWorktypeByID(id: string) {
        const worktype = this.getAll().filter(el => {
            const condition1 = el.id === id;
            return condition1;
        });

        return worktype.length ? worktype[0] : null;
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
                const fetch$ = this.worktypeService.fetchWorktypesByUID(uid);
                const store$ = of(ws);
                const comb$ = combineLatest([fetch$, store$]);
                return comb$.pipe(
                    tap(res => {
                        if (!res) return;
                        const [fetchArr, storeArr] = res;
                        if (fetchArr?.length === 0 && storeArr?.length === 0) return;
                        if (storeArr?.length > 0) return;
                        if (fetchArr?.length > 0 && storeArr?.length === 0) {
                            this.worktypeService.setWorktypes(fetchArr);
                        }
                    }),
                )
            }),
            shareReplay()
        )
    }
}
