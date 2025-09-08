import { FormControl, FormGroup } from "@angular/forms"

export interface CheckBoxForm {
  [key: string]: FormControl<boolean>
}

export type CheckBoxFormGroup = FormGroup<CheckBoxForm>

export interface CheckBoxSet {
  [key: string]: boolean
}