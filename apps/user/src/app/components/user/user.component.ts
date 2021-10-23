import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DocumentReference } from '@angular/fire/compat/firestore'
import { UserWithFirestamp, UserWithKey } from '../../models/users.model';

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
  showSuccessMessage = false;

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

}
