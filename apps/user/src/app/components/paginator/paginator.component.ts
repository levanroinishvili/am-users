import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PaginatedUsers, UserPageRequest } from '../../models/users.model';

@Component({
  selector: 'am-user-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {

  @Input() page!: PaginatedUsers;
  @Input() disabled?: boolean;

  @Output() pageRequest = new EventEmitter<UserPageRequest>();

}
