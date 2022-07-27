import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Hour } from './hour.model';

export interface HourState extends EntityState<Hour, number> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'hours', resettable: true })
export class HourStore extends EntityStore<HourState> {
    constructor() {
        super();
    }
}
