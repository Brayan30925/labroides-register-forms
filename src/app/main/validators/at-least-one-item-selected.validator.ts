import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"

interface FormGroupValueModel {
  [key: string]: boolean
}

export function atLeastOneItemSelectedValidator(): ValidatorFn {
  return (control: AbstractControl<FormGroupValueModel>): ValidationErrors | null => {
    const formGroupValues = Object.values(control.value)
    return formGroupValues.length === 0 || formGroupValues.find(value => value) ? null : { "atLeastOneItemSelected": true }
  }
}