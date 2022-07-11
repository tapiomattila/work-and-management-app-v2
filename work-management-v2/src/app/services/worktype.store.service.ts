import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Worktype } from '../utils/models/worktype.interface';

@Injectable({ providedIn: 'root' })
export class WorktypeStoreService {

    private worktypeSubj = new BehaviorSubject<Worktype[]>([]);
    worktypes$ = this.worktypeSubj.asObservable();

    constructor(
    ) { }

    /**
     * Subject store worktype
     * @param worktype Worktype[]
     */
    storeWorktypesPush(worktypes: Worktype[]) {
        const oldData = this.worktypeSubj.getValue();
        const newData = worktypes;
        this.worktypeSubj.next(newData);
    }

    /**
     * Clear store worktypes
     */
    clearWorktypes() {
        this.worktypeSubj.next([]);
    }

    selectWorktypes() {
        return this.worktypes$;
    }
}
