import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { environment } from '../../environments/environment';
import { Firestamp, PaginatedUsers, UserCore, UserPageRequest, UserRole, UserWithFirestamp, UserWithTimestamp } from '../models/users.model';
import { map, take, } from 'rxjs/operators';
import { defer, from } from 'rxjs';

import { DemoConfigService } from './demo-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private rolesCollection = this.firestore.collection<UserRole>(environment.firebaseRolesCollection);
  private usersCollection = this.firestore.collection<UserWithFirestamp>(environment.firebaseUsersCollection);

  roles$ = this.rolesCollection.valueChanges({idField: 'name'}).pipe(take(1));

  constructor(
    private configService: DemoConfigService,
    private firestore: AngularFirestore,
    private httpClient: HttpClient,
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
    const { startAfter, endBefore, limit, search } = specs;
    const collectionRef = this.usersCollection.ref;
    let query = collectionRef.orderBy('name');
    if ( search ) {
      if ( search.name ) {
        const s = this.normalize(search.name);
        query = query.where('name', '>=', s).where('name', '<', s + '\uf8ff');
      }
      if ( search.role ) {
        query = query.where('role', '==', search.role);
      }
    }
    if ( endBefore ) {
      query = query.endBefore(endBefore);
      if ( typeof limit === 'number' ) query = query.limitToLast(limit);
    } else {
      if ( startAfter ) query = query.startAfter(startAfter);
      if ( typeof limit === 'number' ) query = query.limit(limit);
    }

    return Math.random() < this.configService.config.errorProbability
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
    return Math.random() < this.configService.config.errorProbability // Return error with some probability - for demonstration
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

  removeUser(docId: string) {
    return this.httpClient.get<{error?: string, result?: 'Ok'}>(
      '/firebase/amusers-a8e3d/us-central1/deleteUser',
      {
        params: {docId}
      }).pipe(
        map((result) => {
          console.log(result);
          if ( 'error' in result ) throw new Error(result.error as string)
          return result.result;
        })
      ).toPromise()
      .then(console.log, console.warn);
  }

  // removeUser(ref: DocumentReference<UserWithFirestamp>) {
  //   return Math.random() < this.configService.config.errorProbability
  //     ? Promise.reject(new Error('Fake Error ;)')).catch(this.delayError)
  //     : ref.delete().then(this.delayValue, this.delayError);
  // }

  updateUser(ref: DocumentReference<UserWithFirestamp>, user: UserWithTimestamp) {
    return Math.random() < this.configService.config.errorProbability
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
      disabled: typeof user.disabled === 'boolean' ? user.disabled : false,
      timestamp
    };
  }

  private trim(s: string) {
    return s.split(/\s+/).filter(word => word).join(' ');
  }

  private normalize(name: string) {
    return name
      .split(/\s+/) // Split into words
      .filter(word => word) // Remove "empty words"
      .map(word => (word[0]??'').toUpperCase() + word.slice(1)) // Titlecase words
      .join(' '); // Join back into a "sentence" with since space delimiter
  }

  /** Delay certain processes for demo, to show how the app will behave over slow networks */
  private delayForDemo() {
    return Math.ceil(this.configService.config.maxDelay * Math.random());
  }

  private delayValue = <T = unknown>(value: T): Promise<T> =>
     new Promise(resolve => setTimeout(resolve, this.delayForDemo(), value));


  private delayError = (reason: unknown) =>
    new Promise<never>((_, reject) => setTimeout(reject, this.delayForDemo(), reason));

}
