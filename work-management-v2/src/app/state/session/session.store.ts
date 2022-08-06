import { Injectable } from "@angular/core";
import { Store, StoreConfig } from "@datorama/akita";

export interface SessionState {
    uid: string;
    displayName: string;
    email: string;
    photoUrl: string
}

export function createInitialState(): SessionState {
    return {
        uid: '',
        displayName: '',
        email: '',
        photoUrl: ''
    };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'session', resettable: true })
export class SessionStore extends Store<SessionState> {

    constructor() {
        super(createInitialState());
    }
}