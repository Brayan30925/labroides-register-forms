import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"

export function emailDomainValidator(domains: string[]): ValidatorFn {
  return (control: AbstractControl<string>): ValidationErrors | null => {
    const email = control.value?.trim() || ""
    if (email === "") return null // Deja que Validators.required maneje si está vacío

    // Validamos que termine en alguno de los dominios permitidos
    const isValid = domains.some(domain =>
      email.toLowerCase().endsWith(domain.toLowerCase())
    )

    return isValid ? null : { invalidDomain: true }
  }
}
