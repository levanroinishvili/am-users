import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { environment } from '../../environments/environment';
import { Firestamp, PaginatedUsers, UserCore, UserPageRequest, UserRole, UserWithFirestamp, UserWithTimestamp } from '../models/users.model';
import { take, } from 'rxjs/operators';
import { defer, from } from 'rxjs';

import { CONFIG } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private rolesCollection = this.firestore.collection<UserRole>(environment.firebaseRolesCollection);
  private usersCollection = this.firestore.collection<UserWithFirestamp>(environment.firebaseUsersCollection);

  roles$ = this.rolesCollection.valueChanges({idField: 'name'}).pipe(take(1));

  constructor(
    private firestore: AngularFirestore,
  ) { }

  nameExists(name: string) {
    return defer(() => { // Promise is eager. Avoid the Observable also being eager - in case we decide to keep it as an Observable
      const existsPromise = this.usersCollection.ref.where('name', '==', name)
      .get()
      .then(results => !! results.size);

      return from(existsPromise);
    })
    .toPromise()
    .then(this.delayValue, this.delayError); // For demonstration purposes only
  }

  /** Get users. */
  getUsers(specs: UserPageRequest = {}): Promise<PaginatedUsers> {
    const { startAfter, endBefore, limit } = specs;
    const collectionRef = this.usersCollection.ref;
    let query = collectionRef.orderBy('name');
    if ( endBefore ) {
      query = query.endBefore(endBefore);
      if ( typeof limit === 'number' ) query = query.limitToLast(limit);
    } else {
      if ( startAfter ) query = query.startAfter(startAfter);
      if ( typeof limit === 'number' ) query = query.limit(limit);
    }

    return Math.random() < CONFIG.demo.errorProbability
      ? Promise.reject().catch(this.delayError) as Promise<PaginatedUsers> // Simulate fake error for demonstration
      : query.get().then(response => ({ // Occasionally attempt to return an actual response from server
      isFirstPage: ! startAfter && (! endBefore || response.size < (limit ?? Infinity)),
      isLastPage: ! endBefore && response.size < (limit ?? Infinity),
      firstDoc: response.docs[0] ?? null,
      lastDoc: response.docs[response.docs.length - 1] ?? null,
      allDocs: response.docs.map(doc => ({
        id: doc.id,
        ref: doc.ref,
        data: this.normalizeUser(doc.data())
      }))
    }))
    .then(this.delayValue, this.delayError);
  }

  addUser(user: UserCore) {
    return Math.random() < CONFIG.demo.errorProbability // Return error with some probability - for demonstration
      // Return a rejected promise with some randome delay for demo purposes
      ? Promise.reject(new Error('404 ;)')).catch(this.delayError)
      // Occasionally we still have to actually add the user ;)
      : this.usersCollection.add({
      ...user,
      name: this.trim(user.name),
      timestamp: new Date() as unknown as Firestamp
    })
    .then(this.delayValue, this.delayError) // Delay promise for demonstration purposes
  }

  removeUser(ref: DocumentReference<UserWithFirestamp>) {
    return Math.random() < CONFIG.demo.errorProbability
      ? Promise.reject(new Error('Fake Error ;)')).catch(this.delayError)
      : ref.delete().then(this.delayValue, this.delayError);
  }

  updateUser(ref: DocumentReference<UserWithFirestamp>, user: UserWithTimestamp) {
    return Math.random() < CONFIG.demo.errorProbability
      ? Promise.reject(new Error('Fake Error ;)')).catch(this.delayError)
      : ref.update(user).then(this.delayValue, this.delayError);
  }

  private normalizeUser(user: UserWithFirestamp): UserWithTimestamp {
    const milliseconds = 1e3 * user.timestamp?.seconds + user.timestamp?.nanoseconds / 1e6;
    let timestamp: Date | null = new Date(milliseconds);
    timestamp = isNaN(timestamp.getTime()) ? null : timestamp;

    return {
      name: user.name ?? '&lt;Invalid&gt;',
      role: user.role ?? '&lt;Invalid&gt;',
      timestamp
    };
  }

  private trim(s: string) {
    return s.split(/\s+/).filter(word => word).join(' ');
  }

  /** Delay certain processes for demo, to show how the app will behave over slow networks */
  private delayForDemo() {
    return Math.ceil(CONFIG.demo.maxDelay * Math.random());
  }

  private delayValue = <T = unknown>(value: T): Promise<T> =>
     new Promise(resolve => setTimeout(resolve, this.delayForDemo(), value));


  private delayError = (reason: unknown) =>
    new Promise<never>((_, reject) => setTimeout(reject, this.delayForDemo(), reason));

}
