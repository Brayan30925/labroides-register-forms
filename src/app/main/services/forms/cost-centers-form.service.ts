import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal
} from "@angular/core"
import { NonNullableFormBuilder } from "@angular/forms"
import { EquitelService } from "../api/equitel.service"
import { CostCenter } from "../../models/dto/CostCenter"
import { atLeastOneItemSelectedValidator } from "../../validators/at-least-one-item-selected.validator"
import {
  CheckBoxForm,
  CheckBoxFormGroup
} from "../../models/forms/CheckBoxForm"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root"
})
export class CostCentersFormService {
  costCenters = new BehaviorSubject(new Array<CostCenter>())
  costCentersForm = new BehaviorSubject(<CheckBoxFormGroup>{})

  constructor(private formBuilder: NonNullableFormBuilder, private equitelService: EquitelService) {
    this.costCenters.subscribe({
      next: (costCenters: CostCenter[]): void => {
        const forms: CheckBoxForm = {}
        for (const c of costCenters) forms[c.id] = this.formBuilder.control(false)
        const validators = [atLeastOneItemSelectedValidator()]
        const form = this.formBuilder.group(forms, { validators })
        this.costCentersForm.next(form)
      }
    })
    
    this.equitelService.getAllCostCenters().subscribe({
      next: (c) => this.costCenters.next(c)
    })
  }
}
