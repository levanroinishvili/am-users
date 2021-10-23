import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DbService } from '../services/db.service';

@Injectable({providedIn: 'root'})
export class UniqueNameValidator implements AsyncValidator {
    constructor(private db: DbService) {}

    async validate(control: AbstractControl) {
        const name = control.value?.trim();
        try {
            const exists = await this.db.nameExists(name);
            return exists ? { uniquename: { name } } : null;
        } catch (e) {
            return null;
        }
    }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromList(list$: Observable<any[]>): AsyncValidatorFn {
    return function(control) {
        return list$.pipe(
            take(1),
            map(list => list.includes(control.value)),
            map(valid => valid ? null : {
                fromList: {
                    value: control.value
                }
            })
        );

    };
}
