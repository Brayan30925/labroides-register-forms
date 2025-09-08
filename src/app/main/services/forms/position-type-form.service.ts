import { Injectable, signal, WritableSignal } from "@angular/core"
import { FormBuilder } from "@angular/forms"
import { PositionType, PositionTypeFormGroup, PositionTypeFormModel } from "../../models/forms/PositionType"

@Injectable({
  providedIn: "root"
})
export class PositionTypeFormService {
  positionTypeForm: WritableSignal<PositionTypeFormGroup>

  positionTypeFormControls: PositionTypeFormModel = {
    positionType: this.formBuilder.control<PositionType | null>(null)
  }

  constructor(private formBuilder: FormBuilder) {
    this.positionTypeForm = signal(this.formBuilder.group(this.positionTypeFormControls))
  }
}
