import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClrWizard } from '@clr/angular';
import { map } from 'rxjs/operators';
import { UserCore } from '../../models/users.model';
import { DbService } from '../../services/db.service';
import { ViewportService } from '../../services/viewport.service';

import { Validators, UniqueNameValidator } from '../../validators';

type Status = 'idle' | 'waiting' | 'error' | 'success';

@Component({
  selector: 'am-user-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.scss']
})
export class NewuserComponent implements OnDestroy {

  constructor(
    private uniqueNameValidator: UniqueNameValidator,
    private db: DbService,
    private viewport: ViewportService,
  ) { }

  @Output() created = new EventEmitter<void>();

  wizardSize$ = this.viewport.mapViewport<string>('sm', 'md');

  showWizard = false;
  status: Status = 'idle';

  // Extract only role names
  roles$ = this.db.roles$.pipe(map(roles => roles.map(r => r.name)));

  nameControl = new FormControl('', {
    updateOn: 'change', // 'blur'
    validators: [Validators.nonEmpty, Validators.minLength(3), Validators.maxLength(50), Validators.titleCase],
    asyncValidators: this.uniqueNameValidator.validate.bind(this.uniqueNameValidator)
  });

  roleControl = new FormControl('', Validators.required);
  accountDisabledControl = new FormControl(false);

  userForm = new FormGroup({
    name: this.nameControl,
    role: this.roleControl,
    disabled: this.accountDisabledControl,
  });

  // Each time the form is updated, previous errors and submissions no longer matter - it's a new user
  formChangesSubscription = this.userForm.valueChanges.subscribe(() => this.status = 'idle');

  ngOnDestroy() {
    this.formChangesSubscription.unsubscribe();
  }

  submit(lastPage: boolean, user: UserCore) {
    if ( lastPage && (this.status === 'idle' || this.status === 'error') ) {
      this.status = 'waiting';

      this.db.addUser(user)
        .then(() => this.status = 'success')
        .then(() => this.created.next())
        .catch(() => this.status = 'error')
    }
  }

  reset(status: Status, wizard: ClrWizard, form: FormGroup): Status {
    if ( status !== 'idle' ) {
      wizard.reset();
      form.reset();
    }
    return 'idle';
  }
}
