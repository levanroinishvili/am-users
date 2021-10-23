import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator } from '@angular/forms';
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
