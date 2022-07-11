import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, from, Subscription } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

    authSubscription: Subscription | undefined;

    private isAuthenticatedSubj = new BehaviorSubject<boolean>(false);
    isAuthenticated$ = this.isAuthenticatedSubj.asObservable();

    private authStateSubj = new BehaviorSubject<firebase.default.User | null>(null);
    authState$ = this.authStateSubj.asObservable();

    constructor(
        public afAuth: AngularFireAuth,
    ) {
        this.setAuthStateObserver();
    }

    authenticated() {
        return this.afAuth.authState;
    }

    signout() {
        return this.afAuth.signOut();
    }

    selectAuthUser() {
        return from(this.afAuth.currentUser);
    }

    selectAuthState() {
        const authStateChange$ = this.afAuth.authState.pipe(
            shareReplay(),
            // tap(auth => console.log('show auth', auth))
        );
        return authStateChange$;
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

    changeAuthState(auth: firebase.default.User | null) {
        this.authStateSubj.next(auth);
    }

}