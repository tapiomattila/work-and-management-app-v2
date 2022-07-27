import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { shareReplay, tap } from "rxjs/operators";
import { SessionStore } from "./session.store";

@Injectable({ providedIn: 'root' })
export class SessionService {

  constructor(
    private sessionStore: SessionStore,
    public afAuth: AngularFireAuth,
  ) {
  }

  /**
   * Update session store with current user informations
   * @param auth firebase.default.User
   * @returns void
   */
  updateUID(auth: firebase.default.User | null) {
    if (!auth?.uid || !auth.displayName || !auth.email) {
      return;
    }

    this.sessionStore.update({
      uid: auth.uid,
      displayName: auth.displayName,
      email: auth.email
    });
  }

  /**
   * Set auth state and update session store
   * @returns Observable<firebase.User | null>
   */
  setAuthState() {
    return this.afAuth.authState.pipe(
      shareReplay(),
      tap(auth => this.updateUID(auth))
    );
  }

  /**
   * Signout user
   */
  signout() {
    this.afAuth.signOut();
    this.sessionStore.reset();
  }
}