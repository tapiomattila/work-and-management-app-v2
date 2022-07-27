import { Injectable } from "@angular/core";
import { Store, StoreConfig } from "@datorama/akita";

export interface SessionState {
    uid: string;
    displayName: string;
    email: string;
}

export function createInitialState(): SessionState {
    return {
        uid: '',
        displayName: '',
        email: ''
    };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'session', resettable: true })
export class SessionStore extends Store<SessionState> {

    constructor() {
        super(createInitialState());
    }
}