import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Worksite } from './worksite.model';

export interface WorksiteState extends EntityState<Worksite, number> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'worksites', resettable: true })
export class WorksiteStore extends EntityStore<WorksiteState> {

    constructor() {
        super();
    }
}