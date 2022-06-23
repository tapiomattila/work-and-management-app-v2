import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WorksiteStoreService } from './worksite.store.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

    authSubscription: Subscription | undefined;

    isAuthenticatedSubj = new BehaviorSubject<boolean>(false);
    isAuthenticated$ = this.isAuthenticatedSubj.asObservable();

    constructor(
        private wsStore: WorksiteStoreService,
        public afAuth: AngularFireAuth,

    ) {
        this.setAuthStateObserver();
    }

    authenticated() {
        return this.afAuth.authState;
    }

    signout() {
        this.wsStore.clearWorksites();
        return this.afAuth.signOut();
    }

    private setAuthStateObserver() {
        this.authSubscription = this.authenticated().pipe(
            tap(auth => {
                if (auth && auth.uid !== null) {
                    this.isAuthenticatedSubj.next(true);
                } else {
                    this.isAuthenticatedSubj.next(false);
                }
            })
        ).subscribe();
    }

}