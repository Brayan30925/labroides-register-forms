import {Component, OnDestroy, OnInit, Signal, computed} from "@angular/core"
import {CommonModule} from "@angular/common"
import {of, switchMap, Subscription} from "rxjs"
import {ReactiveFormsModule, Validators} from "@angular/forms"
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete"
import {MatCheckboxModule} from "@angular/material/checkbox"
import {MatSlideToggleModule} from "@angular/material/slide-toggle"
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatInputModule} from "@angular/material/input"

import {LabroidesUser} from "../../models/dto/LabroidesUser"
import {OtherAppsFormGroup} from "../../models/forms/OtherApps"
import {SharedModule} from "../../../shared/shared.module"
import {OtherAppsFormService} from "../../services/forms/other-apps-form.service"
import {EquitelService} from "../../services/api/equitel.service"


@Component({
    selector: "app-other-apps-form",
    imports: [
        CommonModule,
        SharedModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatAutocompleteModule
    ],
    templateUrl: "./other-apps-form.component.html",
    styleUrl: "./other-apps-form.component.sass"
})
export class OtherAppsFormComponent implements OnDestroy, OnInit {
    otherAppsForm: Signal<OtherAppsFormGroup>

    approverUsers: LabroidesUser[] = []

    private subscriptions = new Subscription()

    constructor(
        private otherAppsService: OtherAppsFormService,
        private equitelService: EquitelService
    ) {
        this.otherAppsForm = computed(() => this.otherAppsService.otherAppsForm())
    }

    ngOnInit(): void {
        // 1. Suscripción para gestionar el slide-toggle de 'supplyChain'
        this.subscriptions.add(
            this.otherAppsForm().controls.supplyChain.valueChanges.subscribe((isToggled: boolean) => {
                const issuanceControl = this.otherAppsForm().controls.electronicInvoicesIssuance
                const receptionControl = this.otherAppsForm().controls.electronicInvoicesReception
                const supportControl = this.otherAppsForm().controls.supportDocsAccess

                if (isToggled) {
                    issuanceControl.enable()
                    receptionControl.enable()
                    supportControl.enable()
                } else {
                    issuanceControl.disable()
                    receptionControl.disable()
                    supportControl.disable()
                    issuanceControl.setValue(false)
                    receptionControl.setValue(false)
                    supportControl.setValue(false)
                }
            })
        )

        // 2. Suscripción para gestionar el slide-toggle de 'Viaticos'
        this.subscriptions.add(
            this.otherAppsForm().controls.travelExpenses.valueChanges.subscribe((isToggled: boolean) => {
                const approverControl = this.otherAppsForm().controls.travelExpensesApprover

                if (isToggled) {
                    approverControl.enable()
                    approverControl.setValidators(Validators.required)
                } else {
                    approverControl.disable()
                    approverControl.clearValidators()
                    approverControl.setValue('')
                }
                approverControl.updateValueAndValidity()
            })
        )

        // 3. Suscripción para la búsqueda de usuarios en el campo de aprobador
        this.subscriptions.add(
            this.otherAppsForm().controls.travelExpensesApprover.valueChanges.pipe(
                switchMap((value: string | null) => {
                    if (!value || value.length < 3) return of([])
                    return this.equitelService.getUsersByName(value)
                })
            ).subscribe({
                next: (users: LabroidesUser[]) => this.approverUsers = users,
                error: () => this.approverUsers = []
            })
        )
    }

    /**
     * Método que se ejecuta al seleccionar una opción del autocompletado.
     * @param event El evento de selección del MatAutocomplete.
     */
    onApproverSelection(event: MatAutocompleteSelectedEvent) {
        if (event.option.value) {
            // Lógica adicional si se selecciona un aprobador.
        }
    }

    /**
     * Método del ciclo de vida para desuscribirnos y evitar fugas de memoria.
     */
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe()
    }
}