import { Component, Signal, WritableSignal, computed } from "@angular/core"
import { SharedModule } from "src/app/shared/shared.module"
import { Company } from "../../models/dto/Company"
import { OperationCenter } from "../../models/dto/OperationCenter"
import { PurchasingGroup } from "../../models/dto/PurchasingGroup"
import { PurchasingGroupsFormService } from "../../services/forms/purchasing-groups-form.service"
import { CompaniesFormService } from "../../services/forms/companies-form.service"
import { OperationCentersFormService } from "../../services/forms/operation-centers-form.service"
import { PositionTypeFormService } from "../../services/forms/position-type-form.service"
import { PositionTypeFormGroup } from "../../models/forms/PositionType"
import { MatCheckboxModule } from "@angular/material/checkbox"
import { MatRadioModule } from "@angular/material/radio"
import { MatDividerModule } from "@angular/material/divider"
import { CheckBoxFormGroup } from "../../models/forms/CheckBoxForm"

@Component({
    selector: "app-specific-data-form",
    templateUrl: "./specific-data-form.component.html",
    styleUrl: "./specific-data-form.component.sass",
    imports: [SharedModule, MatCheckboxModule, MatRadioModule, MatDividerModule]
})
export class SpecificDataFormComponent {
  purchasingGroups: WritableSignal<PurchasingGroup[]>
  purchasingGroupsForm: Signal<CheckBoxFormGroup>
  companies: WritableSignal<Company[]>
  companiesForm: Signal<CheckBoxFormGroup>
  operationCenters: WritableSignal<OperationCenter[]>
  operationCentersForm: Signal<CheckBoxFormGroup>
  positionTypeForm: WritableSignal<PositionTypeFormGroup>

  purchasingGroupsFiltered: Signal<PurchasingGroup[]>
  // !!! NUEVO: Signal computado para las ciudades filtradas !!!
  operationCentersFiltered: Signal<OperationCenter[]>

  constructor(
    private pgfService: PurchasingGroupsFormService,
    private cfService: CompaniesFormService,
    private ocfService: OperationCentersFormService,
    private sfService: PositionTypeFormService
  ) {
    this.purchasingGroups = this.pgfService.purchasingGroups
    this.purchasingGroupsForm = this.pgfService.purchasingGroupsForm
    this.companies = this.cfService.companies
    this.companiesForm = this.cfService.companiesForm
    this.operationCenters = this.ocfService.operationCenters
    this.operationCentersForm = this.ocfService.operationCentersForm
    this.positionTypeForm = this.sfService.positionTypeForm

    this.purchasingGroupsFiltered = computed(() => {
      return this.purchasingGroups().filter(group => group.name !== 'Viaticos')
    })
    
    // !!! Inicializa el nuevo signal computado para las ciudades !!!
    this.operationCentersFiltered = computed(() => {
      const citiesToExclude = ['DUITAMA', 'BUCARAMANGA', 'MALAMBO'];
      return this.operationCenters().filter(center => !citiesToExclude.includes(center.name));
    });
  }
}