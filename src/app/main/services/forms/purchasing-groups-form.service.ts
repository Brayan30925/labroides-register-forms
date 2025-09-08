import { computed, Injectable, signal, Signal, WritableSignal } from "@angular/core"
import { PurchasingGroup } from "../../models/dto/PurchasingGroup"
import { NonNullableFormBuilder } from "@angular/forms"
import { EquitelService } from "../api/equitel.service"
import { CheckBoxForm, CheckBoxFormGroup } from '../../models/forms/CheckBoxForm'


@Injectable({
  providedIn: "root"
})
export class PurchasingGroupsFormService {
  purchasingGroups: WritableSignal<PurchasingGroup[]>
  purchasingGroupsForm: Signal<CheckBoxFormGroup>

  constructor(private formBuilder: NonNullableFormBuilder, private equitelService: EquitelService) {
    this.purchasingGroups = signal([])

    this.purchasingGroupsForm = computed(() => {
      const formControls: CheckBoxForm = {}
      this.purchasingGroups().forEach((pg) => formControls[pg.id] = this.formBuilder.control(false))
      return this.formBuilder.group(formControls)
    })

    this.equitelService.getAllPurchasingGroups().subscribe({ next: (pg) => this.purchasingGroups.set(pg) })
  }
}
