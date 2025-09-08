import { FormControl, FormGroup } from "@angular/forms"

export interface ApplicantFormModel {
  email: FormControl<string>
  name: FormControl<string>
  observations: FormControl<string>
}

export type ApplicantFormGroup = FormGroup<ApplicantFormModel>