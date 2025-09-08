import { Injectable, signal, WritableSignal } from "@angular/core"
import { NonNullableFormBuilder, Validators } from "@angular/forms" // Agregado Validators
import { OtherAppsFormGroup } from "../../models/forms/OtherApps"

@Injectable({
  providedIn: "root"
})
export class OtherAppsFormService {
  otherAppsForm: WritableSignal<OtherAppsFormGroup>

  constructor(formBuilder: NonNullableFormBuilder) {
    this.otherAppsForm = signal(formBuilder.group({
      integrator: formBuilder.control(false),
      innovation: formBuilder.control(false),
      supplyChain: formBuilder.control(false),
      crm: formBuilder.control(false),
      electronicInvoicesIssuance: formBuilder.control({ value: false, disabled: true }),
      electronicInvoicesReception: formBuilder.control({ value: false, disabled: true }),
      supportDocsAccess: formBuilder.control({ value: false, disabled: true }),
      // !!! NUEVOS CONTROLES PARA VIATICOS !!!
      travelExpenses: formBuilder.control(false),
      travelExpensesApprover: formBuilder.control({ value: '', disabled: true })
    })) as WritableSignal<OtherAppsFormGroup>
  }
}