import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore'
import { UserWithKey, UserWithTimestamp } from '../../models/users.model';

@Component({
  selector: 'am-user-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('user') userAndKey!: UserWithKey;
  @Output() removed = new EventEmitter<string>();

  showRemoveDialog = false;
  showErrorMessage = false;

  remove(ref: DocumentReference<UserWithTimestamp>) {
    ref.delete()
      .then(
        () => {
          this.showRemoveDialog = false;
          this.removed.next(this.userAndKey.id);
        },
        () => {
          this.showRemoveDialog = false;
          this.showErrorMessage = true;
        }
      )
  }

}
