
// 31/12/2020
// 31/12/2020 11:59

import { ValidatorFn } from "@angular/forms";

/** Convert JavaScript Date object into something that Clarity Datepicker undestands */
export function formatDate(date: Date | null) {
    if ( ! (date instanceof Date) ) return '';
    return `${date.getDate()}/${1+date.getMonth()}/${date.getFullYear()}`;
}

/** Convert string representing Clarity Date to JavaScript Date object
 * returns null if string is not in the valid format
 * allows optional time after the date, which is not supported by Clarity Datepicker,
 * but is useful, if the user manually enters the date in Clarty Datepicker
*/
export function unformatDate(date: string) {
    const dateTimeRegEx = /^\s*(\d{1,2})\s*\/\s*(\d{1,2})\s*\/\s*(\d{4})\s*((\d{1,2})\s*:\s*(\d{1,2}))?\s*$/;
    const [, dd, mm, yyyy, , hr, min] = date?.match(dateTimeRegEx) ?? [];
    const datetime = new Date(+yyyy, +mm-1, +dd, hr ? +hr : 0, min ? +min : 0);
    if (isNaN(datetime.getTime())) return null;

    // Check if date elements overflew ;), e.g. 32/13/2020 12:60
    if ( datetime.getFullYear() !== +yyyy ) return null;
    if ( datetime.getMonth() +1 !== +mm ) return null;
    if ( datetime.getDate() !== +dd ) return null;
    if ( hr && datetime.getHours() !== +hr ) return null;
    if ( min && datetime.getMinutes() !== +min ) return null;

    return datetime;
}

export const clrDateValidator: ValidatorFn = control => {
    const value = control.value;
    if ( value === null ) return null;
    if ( typeof value === 'string' ) {
        if ( value.trim() === '' ) return null;
        if ( unformatDate(value) ) return null;
    }
    return {
        clrDateValidator: {
            value,
            error: 'Invalid date string',
            format: '31/12/2000 or 31/12/2000 11:59'
        }
    };
}
