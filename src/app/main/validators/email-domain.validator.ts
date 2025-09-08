import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"

export function emailDomainValidator(domain: string): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const email = control.value
    if (email.trim() === "" || email.endsWith(domain)) return null
    else return { invalidDomain: true }
  }
}