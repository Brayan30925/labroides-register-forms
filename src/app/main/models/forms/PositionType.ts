import { FormControl, FormGroup } from "@angular/forms"

export interface PositionTypeFormModel {
  positionType: FormControl<PositionType | null>
}

export type PositionTypeFormGroup = FormGroup<PositionTypeFormModel>

export type PositionType = "TECHNICIAN" | "COMERCIAL ASSESSOR" | "NONE"

