import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { shareReplay, tap } from "rxjs/operators";
import { SessionStore } from "./session.store";

@Injectable({ providedIn: 'root' })
export class SessionService {

  constructor(
    private store: SessionStore,
    public afAuth: AngularFireAuth,
  ) {
  }

  /**
   * Update session store with current user informations
   * @param auth firebase.default.User
   * @returns void
   */
  updateUID(auth: firebase.default.User | null) {
    if (!auth?.uid || !auth.displayName || !auth.email || !auth.photoURL) {
      return;
    }

    this.store.update({
      uid: auth.uid,
      displayName: auth.displayName,
      email: auth.email,
      photoUrl: auth.photoURL
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
    this.store.reset();
  }
}