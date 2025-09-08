import {Component, inject, OnInit} from "@angular/core"
import {CommonModule} from "@angular/common"
import {SharedModule} from "../../../shared/shared.module"
import {CostCenter} from "../../models/dto/CostCenter"
import {CostCentersFormService} from "../../services/forms/cost-centers-form.service"
import {MatCheckboxModule} from "@angular/material/checkbox"
import {CheckBoxFormGroup} from "../../models/forms/CheckBoxForm"
import {FormBuilder, ReactiveFormsModule} from "@angular/forms"

@Component({
    selector: "app-cost-centers-form",
    imports: [CommonModule, SharedModule, MatCheckboxModule, ReactiveFormsModule],
    templateUrl: "./cost-centers-form.component.html",
    styleUrl: "./cost-centers-form.component.sass"
})
export class CostCentersFormComponent implements OnInit {
    costCentersFormService: CostCentersFormService = inject(CostCentersFormService)
    fb: FormBuilder = inject(FormBuilder)
    costCentersForm: CheckBoxFormGroup = {} as CheckBoxFormGroup

    costCenters: CostCenter[] = []
    visibleCostCenters: CostCenter[] = []
    selectedGroups: string[] = []
    allSelected = false

    // Lista de grupos predefinidos
    costCenterGroups = [
        {id: '01', name: 'SERVICIO'},
        {id: '02', name: 'REPUESTOS'},
        {id: '03', name: 'GAF'},
        {id: '04', name: 'ENERGIA'},
        {id: '05', name: 'M&M'},
        {id: '06', name: 'CAPACITACIONES'},
        {id: '07', name: 'MOTORES'},
        {id: '08', name: 'EQUITEL BUSES'},
        {id: '09', name: 'EQUITEL BUSES MTTO'},
        {id: '10', name: 'GRUAS'},
        {id: '11', name: 'QSRT'},
        {id: '12', name: 'RTM'},
        {id: '13', name: 'FLOTA'},
        {id: '14', name: 'LAP'},
        {id: '15', name: 'EQUITEL TECNOLOGIA'},
        {id: '16', name: 'IG O&M - SIST AUX'},
        {id: '17', name: 'IG O&M - OPER'},
        {id: '18', name: 'IG O&M - MTTO'},
        {id: '60', name: 'EQUITEL VENTURES'},
        {id: '90', name: 'ADMINISTRACION GENERAL'},
        {id: '99', name: 'CENTRO DE COSTO DE ASIGNACION FIJA'}
    ]

    constructor() {
    }

    ngOnInit(): void {
        this.costCentersFormService.costCenters.subscribe(c => {
            this.costCenters = c
            this.filterVisibleCostCenters() // Inicializa los visibles
        })

        this.costCentersFormService.costCentersForm.subscribe(cf => {
            this.costCentersForm = cf

            this.costCentersForm.valueChanges?.subscribe(values => {
                this.allSelected = Object.values(values).every(v => v === true)
            })
        })
    }

    toggleAllCostCenters(checked: boolean): void {
        this.allSelected = checked
        this.visibleCostCenters.forEach(cc => {
            this.costCentersForm.get(cc.id)?.setValue(checked)
        })
    }

    onGroupSelectionChange(): void {
        this.filterVisibleCostCenters()
    }

    private filterVisibleCostCenters(): void {
        this.visibleCostCenters = this.costCenters.filter(cc =>
            this.selectedGroups.includes(cc.id.substring(0, 2))
        )
    }
}
