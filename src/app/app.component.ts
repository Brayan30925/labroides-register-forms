import { Component, effect, EffectRef, signal, WritableSignal } from "@angular/core"

import { FormGroup } from "@angular/forms"
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

const components = [BasicDataFormComponent, SpecificDataFormComponent, CostCentersFormComponent, StoresFormComponent, OtherAppsFormComponent, RegisterResponsibleFormComponent]
const materialModules = [MatTabsModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule]
const directives = [NgOptimizedImage]

@Component({
    selector: "app-root",
    templateUrl: "app.component.html",
    styleUrls: ["app.component.sass"],
    imports: [SharedModule, ...directives, ...components, ...materialModules]
})
export class AppComponent {
  currentFormIndex: WritableSignal<number>
  registerRequestLoading: boolean
  tabsStatus: boolean[]
  isTechnician: boolean = false

  constructor(private basicDataFormService: BasicDataFormService, private operationCentersService: OperationCentersFormService, private companiesService: CompaniesFormService,
              private costCentersService: CostCentersFormService, private storesService: StoresFormService, private purchasingGroupsService: PurchasingGroupsFormService,
              private positionTypeService: PositionTypeFormService, private otherAppsService: OtherAppsFormService, protected applicantService: ApplicantFormService,
              private equitelService: EquitelService, private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.registerRequestLoading = false
    this.tabsStatus = [true, false, false, false, false, false]
    this.currentFormIndex = signal(0)
  }

  onTechnicianStatusChange(isTechnician: boolean): void {
    this.isTechnician = isTechnician
  }

  showMessage(message: string) {
    this.snackBar.open(message, "OK", { duration: 4000 })
  }

  isFormValid(form: FormGroup) {
    form.updateValueAndValidity()
    form.markAllAsTouched()
    return form.valid
  }

  isCurrentFormValid(): boolean {
    let formValid: boolean

    if (this.currentFormIndex() === 0) {
      formValid = this.isFormValid(this.basicDataFormService.basicDataForm)
      if (!formValid) this.showMessage("¡Revisa el formulario! Algunos datos están mal")
    } else if (this.currentFormIndex() === 1) {
      const validCompaniesForm = this.isFormValid(this.companiesService.companiesForm())
      const validOperationCentersForm = this.isFormValid(this.operationCentersService.operationCentersForm())
      if (!validCompaniesForm) this.showMessage("¡Recuerda que debes seleccionar al menos una empresa!")
      if (!validOperationCentersForm) this.showMessage("¡Recuerda que debes seleccionar al menos un centro de operaciones!")
      formValid = validCompaniesForm && validOperationCentersForm
    } else if (this.currentFormIndex() === 2) {
      formValid = this.isFormValid(this.costCentersService.costCentersForm.getValue())
      if (!formValid) this.showMessage("¡Recuerda que debes seleccionar al menos un centro de costo!")
    } else if (this.currentFormIndex() === 3) {
      formValid = this.isFormValid(this.storesService.storesForm())
      if (!formValid) this.showMessage("¡Debes seleccionar al menos una bodega!")
    } else if (this.currentFormIndex() === 4) {
      formValid = this.isFormValid(this.otherAppsService.otherAppsForm())
      if (!formValid) this.showMessage("¡Hay un error en el formulario de otras apps!")
    } else if (this.currentFormIndex() === 5) {
      formValid = this.isFormValid(this.applicantService.applicantForm())
      if (!formValid) this.showMessage("¡Hay algún error en los datos de registro del responsable del formulario!")
    } else {
      formValid = true
    }

    return formValid
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

  getSelectedItems = (formValue: CheckBoxSet): string[] => Object.keys(formValue).filter(id => formValue[id])

  getRequestData(): RegisterUserRequest {
    const positionTypeData = this.positionTypeService.positionTypeForm().getRawValue()
    return <RegisterUserRequest>{
      basicData: this.basicDataFormService.basicDataForm.getRawValue(),
      otherApps: this.otherAppsService.otherAppsForm().getRawValue(),
      applicationData: this.applicantService.applicantForm().getRawValue(),
      selectedCompanies: this.getSelectedItems(this.companiesService.companiesForm().getRawValue()),
      selectedOperationCenters: this.getSelectedItems(this.operationCentersService.operationCentersForm().getRawValue()),
      selectedPurchasingGroups: this.getSelectedItems(this.purchasingGroupsService.purchasingGroupsForm().getRawValue()),
      selectedCostCenters: this.getSelectedItems(this.costCentersService.costCentersForm.getValue().getRawValue()),
      selectedStores: this.getSelectedItems(this.storesService.storesForm().getRawValue()),
      isTechnician: this.isTechnician,
      isComercialAssessor: positionTypeData.positionType === "COMERCIAL ASSESSOR"
    }
  }

  resetForms(): void {
    this.basicDataFormService.basicDataForm.reset()
    this.companiesService.companiesForm().reset()
    this.operationCentersService.operationCentersForm().reset()
    this.costCentersService.costCentersForm.getValue().reset()
    this.purchasingGroupsService.purchasingGroupsForm().reset()
    this.storesService.storesForm().reset()
    this.applicantService.applicantForm().reset()
    this.positionTypeService.positionTypeForm().reset()
    this.otherAppsService.otherAppsForm().reset()
  }

  // !!! CORRECCIÓN: Se agrega la lógica para reiniciar el estado de la aplicación !!!
  onSuccessfulSubmit(r: EmptyResponse) {
    this.registerRequestLoading = false
    const dialogData = { message: r.description }
    this.dialog.open(ConfirmationDialogComponent, { data: dialogData })
    
    // Reiniciar todos los formularios
    this.resetForms()
    
    // Volver a la primera pestaña
    this.currentFormIndex.set(0)
    
    // Reiniciar el estado de las pestañas
    this.tabsStatus = [true, false, false, false, false, false]
    
    // Reiniciar el estado de la variable de técnico
    this.isTechnician = false
  }

  requestUserRegistration() {
    this.registerRequestLoading = true
    this.equitelService.createUser(this.getRequestData()).subscribe({ next: this.onSuccessfulSubmit.bind(this) })
  }
}