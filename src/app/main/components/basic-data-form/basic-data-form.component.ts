import {Component, OnInit, OnDestroy, Output, EventEmitter, inject} from "@angular/core"
import {SharedModule} from "src/app/shared/shared.module"
import {BasicDataFormGroup} from "../../models/forms/BasicData"
import {Company} from "../../models/dto/Company"
import {OperationCenter} from "../../models/dto/OperationCenter"
import {EquitelService} from "../../services/api/equitel.service"
import {UnitDeal} from "../../models/dto/UnitDeal"
import {CostCenter} from "../../models/dto/CostCenter"
import {LabroidesUser} from "../../models/dto/LabroidesUser"
import {MatSelectChange, MatSelectModule} from "@angular/material/select"
import {BasicDataFormService} from "../../services/forms/basic-data-form.service"
import {MatInputModule} from "@angular/material/input"
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete"
import {BehaviorSubject, Subscription, switchMap} from "rxjs"
import {MatCheckboxModule} from '@angular/material/checkbox'
import {Validators, AbstractControl} from "@angular/forms"
import {MatSnackBar} from "@angular/material/snack-bar"

@Component({
    selector: "app-basic-data-form",
    standalone: true, // Agregado para que sea un componente standalone
    templateUrl: "./basic-data-form.component.html",
    styleUrl: "./basic-data-form.component.sass",
    imports: [
        SharedModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatCheckboxModule
    ]
})
export class BasicDataFormComponent implements OnInit, OnDestroy {
    formService: BasicDataFormService = inject(BasicDataFormService)
    equitelServices: EquitelService = inject(EquitelService)
    basicDataForm: BasicDataFormGroup

    operationCenters: OperationCenter[]
    companies: Company[]
    unitDeals: UnitDeal[]
    costCenters: BehaviorSubject<CostCenter[]>
    replacementUsers: LabroidesUser[]
    replacementProfile: string

    snackBar: MatSnackBar = inject(MatSnackBar)

    @Output() technicianStatusChanged = new EventEmitter<boolean>()

    private subscriptions = new Subscription()

    get formControls() {
        return this.basicDataForm.controls
    }

    constructor() {
        this.basicDataForm = this.formService.basicDataForm
        this.costCenters = new BehaviorSubject(new Array<CostCenter>())
        this.operationCenters = []
        this.companies = []
        this.unitDeals = []
        this.replacementUsers = []
        this.replacementProfile = ""
    }

    onUnitDealChange(event: MatSelectChange) {
        this.equitelServices.getCostCentersByUnitDeal(event.value).subscribe({
            next: costCenters => this.costCenters.next(costCenters),
            error: () => this.costCenters.next([])
        })
    }

    onReplacementSelection(event: MatAutocompleteSelectedEvent) {
        if (event.option.value === undefined || event.option.value === null) return
        const user = this.replacementUsers.find(u => u.name === event.option.value)
        if (user === undefined) throw new Error("Hubo un error al seleccionar el usuario")
        this.equitelServices.getProfileByUser(user.id).subscribe(p => this.formControls.profile.setValue(p.name))
    }

    ngOnInit(): void {
        this.subscriptions.add(
            this.formControls.isTechnician.valueChanges.subscribe(isTechnician => {
                if (isTechnician && !this.personalDataFormIsValid()) {
                    this.snackBar.open("Por favor, completa primero los datos personales.", "Cerrar", {
                        duration: 4000,
                    })
                    this.formControls.isTechnician.setValue(false, {emitEvent: false})
                    return
                }

                this.technicianStatusChanged.emit(isTechnician)

                const companyControl = this.formControls.company
                const operationCenterControl = this.formControls.operationCenter
                const unitDealControl = this.formControls.unitDeal
                const costCenterControl = this.formControls.costCenter
                const positionControl = this.formControls.position
                const previousUserControl = this.formControls.previousUser
                const profileControl = this.formControls.profile

                if (isTechnician) {
                    // Ocultar Usuario Anterior y pre-llenar Cargo y Perfil
                    previousUserControl.disable()
                    previousUserControl.clearValidators()
                    previousUserControl.setValue('')

                    positionControl.setValue('TECNICO')
                    positionControl.disable()
                    positionControl.clearValidators()

                    profileControl.setValue('TECNICO')
                    profileControl.disable()
                    profileControl.clearValidators()

                } else {
                    // Habilitar y re-aplicar validaciones
                    companyControl.enable()
                    companyControl.setValidators(Validators.required)

                    operationCenterControl.enable()
                    operationCenterControl.setValidators(Validators.required)

                    unitDealControl.enable()
                    unitDealControl.setValidators(Validators.required)

                    costCenterControl.enable()
                    costCenterControl.setValidators(Validators.required)

                    // Habilitar y limpiar campos específicos
                    positionControl.enable()
                    // CORRECCIÓN: Agregamos el validador `pattern` para que no acepte solo espacios
                   
                    positionControl.setValue('')

                    previousUserControl.enable()
                    // CORRECCIÓN: Agregamos el validador `pattern` para que no acepte solo espacios
                    
                    previousUserControl.setValue('')

                    profileControl.enable()
                    profileControl.setValue('')
                }

                // Actualizar el estado de validación de cada control
                companyControl.updateValueAndValidity()
                operationCenterControl.updateValueAndValidity()
                unitDealControl.updateValueAndValidity()
                costCenterControl.updateValueAndValidity()
                positionControl.updateValueAndValidity()
                previousUserControl.updateValueAndValidity()
                profileControl.updateValueAndValidity()
            })
        )

        this.equitelServices.getAllOperationCenters().subscribe({
            next: oc => (this.operationCenters = oc)
        })

        this.equitelServices.getAllCompanies().subscribe({
            next: c => (this.companies = c)
        })

        this.equitelServices.getAllUnitDeals().subscribe({
            next: ud => (this.unitDeals = ud)
        })

        this.formControls.previousUser.valueChanges.pipe(
            switchMap(value => this.equitelServices.getUsersByName(value))
        ).subscribe({next: u => (this.replacementUsers = u)})

        this.costCenters.subscribe({
            next: values => {
                if (values.length === 0) this.formControls.costCenter.disable()
                else this.formControls.costCenter.enable()
            }
        })
    }

    private personalDataFormIsValid(): boolean {
        const personalDataControls = ['docId', 'name', 'lastName', 'email', 'phoneNumber']
        const formControls = this.basicDataForm.controls as unknown as { [key: string]: AbstractControl | null }

        personalDataControls.forEach(controlName => {
            formControls[controlName]?.markAsTouched()
        })

        return personalDataControls.every(controlName => formControls[controlName]?.valid)
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe()
    }
}