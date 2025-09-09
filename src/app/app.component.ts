import { Component, effect, EffectRef, signal, WritableSignal } from "@angular/core"
import { FormBuilder, FormGroup } from "@angular/forms"
import { NgOptimizedImage } from "@angular/common"
import { MatTabsModule } from "@angular/material/tabs"
import { MatButtonModule } from "@angular/material/button"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatSnackBar } from "@angular/material/snack-bar"
import { MatDialog } from "@angular/material/dialog"

import { SharedModule } from "./shared/shared.module"
import { BasicDataFormComponent } from "./main/components/basic-data-form/basic-data-form.component"
import { CostCentersFormComponent } from "./main/components/cost-centers-form/cost-centers-form.component"
import { OtherAppsFormComponent } from "./main/components/other-apps-form/other-apps-form.component"
import { SpecificDataFormComponent } from "./main/components/specific-data-form/specific-data-form.component"
import { StoresFormComponent } from "./main/components/stores-form/stores-form.component"
import { RegisterResponsibleFormComponent } from "./main/components/register-responsible-form/register-responsible-form.component"
import { ConfirmationDialogComponent } from "./main/components/confirmation-dialog/confirmation-dialog.component"

import { BasicDataFormService } from "./main/services/forms/basic-data-form.service"
import { OperationCentersFormService } from "./main/services/forms/operation-centers-form.service"
import { CompaniesFormService } from "./main/services/forms/companies-form.service"
import { CostCentersFormService } from "./main/services/forms/cost-centers-form.service"
import { StoresFormService } from "./main/services/forms/stores-form.service"
import { PurchasingGroupsFormService } from "./main/services/forms/purchasing-groups-form.service"
import { PositionTypeFormService } from "./main/services/forms/position-type-form.service"
import { OtherAppsFormService } from "./main/services/forms/other-apps-form.service"
import { ApplicantFormService } from "./main/services/forms/applicant-form.service"
import { EquitelService } from "./main/services/api/equitel.service"
import { RegisterUserRequest } from "./main/models/request/RegisterUserRequest"
import { CheckBoxSet } from "./main/models/forms/CheckBoxForm"
import { EmptyResponse } from "./main/models/responses/EmptyResponse"

const components = [
  BasicDataFormComponent,
  SpecificDataFormComponent,
  CostCentersFormComponent,
  StoresFormComponent,
  OtherAppsFormComponent,
  RegisterResponsibleFormComponent,
]
const materialModules = [MatTabsModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule]
const directives = [NgOptimizedImage]

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.sass"],
  imports: [SharedModule, ...directives, ...components, ...materialModules],
  standalone: true
})
export class AppComponent {
  currentFormIndex: WritableSignal<number>
  registerRequestLoading = false
  tabsStatus: boolean[]
  isTechnician = false

  masterForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private basicDataFormService: BasicDataFormService,
    private operationCentersService: OperationCentersFormService,
    private companiesService: CompaniesFormService,
    private costCentersService: CostCentersFormService,
    private storesService: StoresFormService,
    private purchasingGroupsService: PurchasingGroupsFormService,
    private positionTypeService: PositionTypeFormService,
    private otherAppsService: OtherAppsFormService,
    protected applicantService: ApplicantFormService,
    private equitelService: EquitelService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.tabsStatus = [true, false, false, false, false, false]
    this.currentFormIndex = signal(0)

    this.masterForm = this.fb.group({
      basicData: this.basicDataFormService.basicDataForm, // Ya no es un signal, se usa directamente
      companies: this.companiesService.companiesForm(),
      operationCenters: this.operationCentersService.operationCentersForm(),
      costCenters: this.costCentersService.costCentersForm.getValue(), // CORRECCIÓN: .getValue()
      stores: this.storesService.storesForm(),
      purchasingGroups: this.purchasingGroupsService.purchasingGroupsForm(),
      otherApps: this.otherAppsService.otherAppsForm(),
      responsible: this.applicantService.applicantForm(),
      positionType: this.positionTypeService.positionTypeForm(),
    })
  }

  onTechnicianStatusChange(isTechnician: boolean) {
    this.isTechnician = isTechnician
  }

  showMessage(message: string) {
    this.snackBar.open(message, "OK", { duration: 4000 })
  }

  isFormValid(form: FormGroup) {
    form.updateValueAndValidity({ onlySelf: false })
    form.markAllAsTouched()
    return form.valid
  }

  isCurrentFormValid(): boolean {
    let currentForm: FormGroup | null = null

    switch (this.currentFormIndex()) {
      case 0:
        currentForm = this.masterForm.get('basicData') as FormGroup
        break
      case 1:
        const validCompanies = this.isFormValid(this.masterForm.get('companies') as FormGroup)
        const validOperations = this.isFormValid(this.masterForm.get('operationCenters') as FormGroup)
        if (!validCompanies) this.showMessage("¡Recuerda que debes seleccionar al menos una empresa!")
        if (!validOperations) this.showMessage("¡Recuerda que debes seleccionar al menos un centro de operaciones!")
        return validCompanies && validOperations

      case 2:
        currentForm = this.masterForm.get('costCenters') as FormGroup
        break

      case 3:
        currentForm = this.masterForm.get('stores') as FormGroup
        break

      case 4:
        currentForm = this.masterForm.get('otherApps') as FormGroup
        break

      case 5:
        currentForm = this.masterForm.get('responsible') as FormGroup
        break

      default:
        return true
    }

    if (currentForm && !this.isFormValid(currentForm)) {
      this.showMessage('¡Revisa los datos de este formulario!')
      return false
    }

    return true
  }

  isInFinalForm() {
    return this.currentFormIndex() === this.tabsStatus.length - 1
  }

  nextPage() {
    if (this.isCurrentFormValid()) {
      if (this.isTechnician) {
        this.currentFormIndex.set(this.tabsStatus.length - 1)
        this.tabsStatus = [true, false, false, false, false, true]
      } else {
        const nextIndex = this.currentFormIndex() + 1
        this.currentFormIndex.set(nextIndex)
        this.tabsStatus[nextIndex] = true
      }
    }
  }

  getSelectedItems = (formValue: CheckBoxSet): string[] =>
    Object.keys(formValue).filter((id) => formValue[id])

  getRequestData(): RegisterUserRequest {
    const positionTypeData = this.positionTypeService.positionTypeForm().getRawValue()
    return <RegisterUserRequest>{
      basicData: this.basicDataFormService.basicDataForm.getRawValue(), // CORRECCIÓN: Sin ()
      otherApps: this.otherAppsService.otherAppsForm().getRawValue(),
      applicationData: this.applicantService.applicantForm().getRawValue(),
      selectedCompanies: this.getSelectedItems(this.companiesService.companiesForm().getRawValue()),
      selectedOperationCenters: this.getSelectedItems(this.operationCentersService.operationCentersForm().getRawValue()),
      selectedPurchasingGroups: this.getSelectedItems(this.purchasingGroupsService.purchasingGroupsForm().getRawValue()),
      selectedCostCenters: this.getSelectedItems(this.costCentersService.costCentersForm.getValue().getRawValue()), // CORRECCIÓN: .getValue()
      selectedStores: this.getSelectedItems(this.storesService.storesForm().getRawValue()),
      isTechnician: this.isTechnician,
      isComercialAssessor: positionTypeData.positionType === "COMERCIAL ASSESSOR",
    }
  }

  resetForms(): void {
    Object.keys(this.masterForm.controls).forEach((key) => {
      this.masterForm.get(key)?.reset()
    })
    this.currentFormIndex.set(0)
    this.tabsStatus = [true, false, false, false, false, false]
    this.isTechnician = false
  }

  onSuccessfulSubmit(r: EmptyResponse) {
    this.registerRequestLoading = false
    this.dialog.open(ConfirmationDialogComponent, { data: { message: r.description } })
    this.resetForms()
  }

  requestUserRegistration() {
    this.masterForm.updateValueAndValidity({ onlySelf: false })
    this.masterForm.markAllAsTouched()

    if (this.masterForm.invalid) {
      this.showMessage("¡Hay datos incompletos! Corrige los errores antes de enviar.")
      return
    }

    this.registerRequestLoading = true
    this.equitelService.createUser(this.getRequestData()).subscribe({
      next: this.onSuccessfulSubmit.bind(this),
    })
  }
}