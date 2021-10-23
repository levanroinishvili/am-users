import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { UserSearchSpec } from './models/users.model';
import { DbService } from './services/db.service';
import { CONFIG } from './app.config';

@Component({
  selector: 'am-user-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(private db: DbService) {}

  newUserCreated = new Subject<void>();
  refreshForNewUser = this.newUserCreated.asObservable();

  roles$ = this.db.roles$.pipe(map(roles => roles.map(r => r.name)));

  searchControl = new FormControl('');
  search$ = combineLatest([
    this.searchControl.valueChanges.pipe(debounceTime(500)),
    this.roles$
  ]).pipe(
    startWith<[string, string[]]>(['', []]),
    map(([search, roles]) => this.parseSearchTerm(search, roles)),
    distinctUntilChanged(this.searchAreSame)
  );

  maxMaxDelay = CONFIG.demo.liveConfig.maxMaxDelay;

  configForm = new FormGroup({
    errorProbability: new FormControl(CONFIG.demo.default.errorProbability),
    maxDelay: new FormControl(CONFIG.demo.default.maxDelay),
  });

  // Will not worry about memory leaks since this will never unsubscribe during the app lifetime
  liveConfigSubscription = this.configForm.valueChanges.subscribe(config => this.db.config = config);

  parseSearchTerm(search: string, roles: string[]): UserSearchSpec {
    const words = search.split(/\s+/).filter(word => word);
    const wordsUppercase = words.map(word => word.toUpperCase());
    const role = roles.find(role => wordsUppercase.includes(role.toUpperCase()));
    const name = words.filter(word => word.toUpperCase() !== role?.toUpperCase()).join(' ') || undefined;
    return { name, role };
  }

  searchAreSame(s1: UserSearchSpec, s2: UserSearchSpec) {
    const keys = Object.keys(s1) as (keyof UserSearchSpec)[];
    return keys.length === Object.keys(s2).length && keys.every(key => s1[key] === s2[key]);
  }
}
