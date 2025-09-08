import { FormControl, FormGroup } from "@angular/forms"

export interface BasicDataFormModel {
  docId: FormControl<string>
  name: FormControl<string>
  lastName: FormControl<string>
  phoneNumber: FormControl<string>
  email: FormControl<string>
  isTechnician: FormControl<boolean> // <-- Add this line
  operationCenter: FormControl<string>
  position: FormControl<string>
  previousUser: FormControl<string>
  company: FormControl<string>
  unitDeal: FormControl<string>
  costCenter: FormControl<string>
  profile: FormControl<string>
}

export type BasicDataFormGroup = FormGroup<BasicDataFormModel>