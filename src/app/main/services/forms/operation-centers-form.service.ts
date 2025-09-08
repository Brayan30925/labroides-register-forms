import { computed, Injectable, Signal, signal, WritableSignal } from "@angular/core"
import { OperationCenter } from "../../models/dto/OperationCenter"
import { EquitelService } from "../api/equitel.service"
import { NonNullableFormBuilder } from "@angular/forms"
import { atLeastOneItemSelectedValidator } from '../../validators/at-least-one-item-selected.validator'
import { CheckBoxForm, CheckBoxFormGroup } from '../../models/forms/CheckBoxForm'

@Injectable({
  providedIn: "root"
})
export class OperationCentersFormService {
  operationCenters: WritableSignal<OperationCenter[]>
  operationCentersForm: Signal<CheckBoxFormGroup>

  constructor(private formBuilder: NonNullableFormBuilder, private equitelService: EquitelService) {
    this.operationCenters = signal([])

    this.operationCentersForm = computed(() => {
      const formControls: CheckBoxForm = {}
      this.operationCenters().forEach(oc => formControls[oc.id] = this.formBuilder.control(false))
      return this.formBuilder.group(formControls, { validators: [atLeastOneItemSelectedValidator()] })
    })

    this.equitelService.getAllOperationCenters().subscribe({
      next: (oc) => this.operationCenters.set(oc)
    })
  }
}
