import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeEnGB from '@angular/common/locales/en-GB';


import { AngularFireModule } from '@angular/fire/compat';
import { FirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { NewuserComponent } from './components/newuser/newuser.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './components/users/users.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserComponent } from './components/user/user.component';
import { PaginatorComponent } from './components/paginator/paginator.component';

registerLocaleData(localeEnGB);

@NgModule({
  declarations: [
    AppComponent,
    NewuserComponent,
    UsersComponent,
    UserComponent,
    PaginatorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FirestoreModule,
    ClarityModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'en-GB'}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
