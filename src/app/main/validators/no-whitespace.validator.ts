import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value != null && control.value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  };
}
