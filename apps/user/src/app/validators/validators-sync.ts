import { ValidatorFn } from '@angular/forms';

export const titleCase: ValidatorFn = control => {
    const value = control.value; // Temporarily type `any`
    if ( ! value || typeof value !== 'string') return null;
    const valid = value
        .split(/\s+/) // Split into separate "words"
        .filter(word => word) // Discard "empty" words (could only occur at start and end)
        .every(word => /^[A-Z]/.test(word)); // Check if every word starts with a capital letter

    return valid ? null : {titlecase: {value}}
};

/** Unlike Angular validator `required`, this validator does not validate strings containing only whitespace */
export const nonEmpty: ValidatorFn = control => {
    const value = control.value;
    if ( ! value || typeof value === 'string' && value.trim() === '') {
        return {nonempty: true};
    } else {
        return null;
    }
}
