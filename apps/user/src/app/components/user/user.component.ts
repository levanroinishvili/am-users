import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore'
import { FormControl, FormGroup } from '@angular/forms';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { UserWithFirestamp, UserWithKey, UserWithTimestamp } from '../../models/users.model';
import { DbService } from '../../services/db.service';
import { fromList, Validators } from '../../validators';
import { clrDateValidator, formatDate, unformatDate } from '../../utils/clarity.utils';
import { Subject } from 'rxjs';

type Status = 'idle' | 'waiting' | 'error' | 'success';

interface UserEdited {
  name: string;
  role: string;
  timestamp: string;
}

@Component({
  selector: 'am-user-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnDestroy {

  @Output() removed = new EventEmitter<string>();
  @Output() updated = new EventEmitter<string>();

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('user')
  get userAndKey() { return this._userAndKey; };
  set userAndKey(userAndKey: UserWithKey) {
    this._userAndKey = userAndKey;
    this.resetForm(userAndKey);
  }
  _userAndKey!: UserWithKey;

  constructor(private db: DbService) {}

  status: Status = 'idle';

  roles$ = this.db.roles$.pipe(map(roles => roles.map(r => r.name)));
  unsubscribeAll = new Subject<void>();
  rolesCached$ = this.roles$.pipe(
    takeUntil(this.unsubscribeAll),
    shareReplay(1)
  );

  roleControl = new FormControl('', Validators.required, fromList(this.rolesCached$));

  nameControl = new FormControl('', {
    updateOn: 'change', // 'blur'
    validators: [Validators.nonEmpty, Validators.minLength(3), Validators.maxLength(50), Validators.titleCase],
  });

  timestampControl = new FormControl('', [Validators.nonEmpty, clrDateValidator]);

  userForm = new FormGroup({
    name: this.nameControl,
    role: this.roleControl,
    timestamp: this.timestampControl,
  });

  showRemoveDialog = false;
  showErrorMessage = false;
  showSuccessMessage = false;

  resetForm(user: UserWithKey) {
    this.userForm.reset({
      ...user.data,
      timestamp: formatDate(user.data.timestamp)
    });
  }

  remove(ref: DocumentReference<UserWithFirestamp>) {
    ref.delete()
      .then(
        () => {
          this.showRemoveDialog = false;
          this.removed.next(this.userAndKey.id);
          this.showSuccessMessage = true;
        },
        () => {
          this.showRemoveDialog = false;
          this.showErrorMessage = true;
        }
      )
  }

  update(lastPage: boolean, userRaw: UserEdited) {
    console.log(userRaw)
    const user: UserWithTimestamp = {...userRaw, timestamp: unformatDate(userRaw.timestamp)};
    console.log(user);
    if ( lastPage ) {
      this.status = 'waiting';
      this.userAndKey.ref.update(user).then(
        () => this.status = 'success',
        () => this.status = 'error'
      );
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
