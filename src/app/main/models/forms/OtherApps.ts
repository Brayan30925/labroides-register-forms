import { FormControl, FormGroup } from "@angular/forms"

export interface OtherAppsFormModel {
  integrator: FormControl<boolean>
  innovation: FormControl<boolean>
  supplyChain: FormControl<boolean>
  crm: FormControl<boolean>
  electronicInvoicesIssuance: FormControl<boolean>
  electronicInvoicesReception: FormControl<boolean>
  supportDocsAccess: FormControl<boolean>
  // ¡Nuevas propiedades para la funcionalidad de Viáticos!
  travelExpenses: FormControl<boolean>
  travelExpensesApprover: FormControl<string>
}

export type OtherAppsFormGroup = FormGroup<OtherAppsFormModel>