import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserWithKey } from '../../models/users.model';

@Component({
  selector: 'am-user-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('user') userAndKey!: UserWithKey;
  @Output() removed = new EventEmitter<string>();

}
