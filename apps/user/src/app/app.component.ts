import { Component } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'am-user-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  newUserCreated = new Subject<void>();
  refreshForNewUser = this.newUserCreated.asObservable();
}
