import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PaginatedUsers, UserPageRequest } from '../../models/users.model';
import { ViewportService } from '../../services/viewport.service';

@Component({
  selector: 'am-user-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent {

  @Input() page!: PaginatedUsers;
  @Input() disabled?: boolean;

  @Output() pageRequest = new EventEmitter<UserPageRequest>();

  small$ = this.viewport.mapViewport(1, -1); // 1 = yes for mobile viewport, -1 = no for the larger viewports

  constructor(
    private viewport: ViewportService,
  ) {}

}
