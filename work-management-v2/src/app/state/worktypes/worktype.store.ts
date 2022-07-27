import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Worktype } from './worktype.model';

export interface WorktypeState extends EntityState<Worktype, number> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'worktypes', resettable: true })
export class WorktypeStore extends EntityStore<WorktypeState> {

    constructor() {
        super();
    }
}