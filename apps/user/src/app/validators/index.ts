import { Validators as AngularValidators } from '@angular/forms';
import { titleCase, nonEmpty } from './validators-sync';

export class Validators extends AngularValidators {
    static titleCase = titleCase;
    static nonEmpty = nonEmpty;
}

export * from './validators-async';
