import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Worksite } from './worksite.model';
import { WorksiteService } from './worksite.service';
import { WorksiteState, WorksiteStore } from './worksite.store';

@Injectable({ providedIn: 'root' })
export class WorksiteQuery extends QueryEntity<WorksiteState> {

    worksites$ = this.selectAll({
        filterBy: entity => entity.deleted !== true
    });

    showRemoved$ = this.selectAll({
        filterBy: entity => entity.deleted === true
    })

    constructor(
        protected store: WorksiteStore,
        private worksiteService: WorksiteService,
    ) {
        super(store);
    }

    // /**
    //  * select store worksites
    //  * @param uid user uid
    //  * @returns Observable<Worksite[]>
    //  */
    selectWorksitesByUID(uid: string) {
        return this.selectAll({
            filterBy: [
                entity => entity.users.includes(uid),
                entity => entity.deleted !== true
            ]
        })
    }

    /**
     * Select worksite from store by its id
     * @param id worksite id
     * @returns Observable<Worksite | null>
     */
    selectWorksiteByID(id: string) {
        return this.selectAll({
            filterBy: [
                entity => entity.id === id,
                entity => entity.deleted === false
            ]
        }).pipe(
            map(els => els ? els[0] : null)
        );
    }

    getWorksiteByID(id: string) {
        const worksite = this.getAll().filter(el => {
            const condition1 = el.id === id;
            const condition2 = el.deleted === false;
            return condition1 && condition2;
        });

        return worksite.length ? worksite[0] : null;
    }

    /**
     * uid from auth state changes in function.
     * fetch from backend or select from store if present.
     * select worksites by UID
     * @returns Observable<Worksite[]>
     */
     selectFetchOrStore(uid: string) {
        if (!uid) {
            return of([]);
        }
        return this.selectWorksitesByUID(uid).pipe(
            switchMap((ws: Worksite[]) => {
                return ws.length ? of(ws) : this.worksiteService.fetchWorksitesByUID(uid).pipe(
                    tap(res => this.worksiteService.setWorksites(res))
                )
            }),
        )
    }
}
