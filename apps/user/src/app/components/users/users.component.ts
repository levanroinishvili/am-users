import { Component } from '@angular/core';
import { combineLatest, EMPTY, of, Subject } from 'rxjs';
import { UserPageRequest, UserWithKey } from '../../models/users.model';
import { DbService } from '../../services/db.service';

import { CONFIG } from '../../app.config';
import { delay, map, startWith, switchMap, tap } from 'rxjs/operators';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

type Status = 'idle' | 'loading' | 'error';

@Component({
  selector: 'am-user-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('flyInOut', [
      transition(':increment, void=>1', [
        query(':enter', [
          style({opacity: 0, transform: 'translate3d(-100%, 0, 0)'}),
          stagger(50, [
            animate('300ms ease-out', style({opacity: 1, transform: '*'}))
          ])
        ], {optional: true}),
      ]),
      transition(':decrement', [
        query(':enter', [
          stagger(50, [
            style({opacity: 0, transform: 'translate3d(+100%, 0, 0)'}),
            animate('300ms ease-out', style({opacity: 1, transform: '*'}))
          ])
        ], {optional: true}),
      ])
    ])
  ]
})
export class UsersComponent {

  constructor( private db: DbService, ) { }

  statusTrigger = new Subject<Status>(); // Put in status here
  status$ = this.statusTrigger.pipe( // Take out status from here
    switchMap(status =>
      status === 'loading'
      ? of<Status>(status).pipe(delay(CONFIG.showLoadingIndicatorAfter)) // Delay shwoing 'loading'
      : of<Status>(status) // Imediately show all states other than 'loading'
    ),
    startWith<Status>('idle')
  );
  disableNavigation = false;

  pageRequest = new Subject<UserPageRequest>(); // Will be used to request pagination

  pageRequestRepeater = new Subject<void>(); // Call next on this Subject to repeat the last pagination call

  pageNo = 0; // For animation: Increases with next page; Decreases with previous page

  // Will contain information about current page & pagination
  page$ = combineLatest([
    this.pageRequest.pipe(startWith<UserPageRequest>({})), // Limit will be added later
    this.pageRequestRepeater.pipe(startWith(undefined))
  ]).pipe(
    map(([pageRequest, ]) => pageRequest),
    map(pageRequest => ({...pageRequest ?? {}, limit: CONFIG.pagesize})), // Always add limit
    tap(() => {this.statusTrigger.next('loading'), this.disableNavigation = true}),
    switchMap(pageRequest => this.db.getUsers(pageRequest)
      .then(data => ({data, pageRequest}), error => ({error})) // Protect pipeline from collapsing due to errors
    ),
    tap(dataOrError => {this.statusTrigger.next('data' in dataOrError ? 'idle' : 'error'); this.disableNavigation = false}),
    switchMap(dataOrError => 'data' in dataOrError ? of(dataOrError) : EMPTY),
    tap(({pageRequest}) => pageRequest.endBefore ? --this.pageNo : ++this.pageNo),
    map(dataAndRequest => dataAndRequest.data)
  );

  userTracker(index: number, user: UserWithKey) {
    return user.id;
  }

  userRemoved(userId: string) {
    console.log()
  }

}
