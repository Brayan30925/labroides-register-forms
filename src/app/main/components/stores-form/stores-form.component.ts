import {Component, computed, effect, Signal} from "@angular/core"
import {CommonModule} from "@angular/common"
import {ReactiveFormsModule} from "@angular/forms"
import {MatCheckboxModule} from "@angular/material/checkbox"
import {StoresFormService} from "../../services/forms/stores-form.service"
import {CheckBoxFormGroup} from '../../models/forms/CheckBoxForm'
import {Store} from "../../models/dto/Store"

@Component({
    selector: "app-stores-form",
    standalone: true,
    imports: [CommonModule, MatCheckboxModule, ReactiveFormsModule],
    templateUrl: "./stores-form.component.html",
    styleUrl: "./stores-form.component.sass"
})
export class StoresFormComponent {
  stores: Signal<Store[]>
  storesForm: Signal<CheckBoxFormGroup>
  // La propiedad 'allStoresSelected' ya no es necesaria
  // allStoresSelected = false

  constructor(private storesFormService: StoresFormService) {
    this.stores = computed(() => this.storesFormService.stores())
    this.storesForm = computed(() => this.storesFormService.storesForm())

    // Se elimina el `effect` que sincronizaba el estado del checkbox general
    // effect(() => {
    //   const form = this.storesForm()
    //   if (!form) return
    //   const values = form.getRawValue()
    //     this.allStoresSelected = Object.values(values).every(v => v)
    // })
  }

  // El método 'toggleAllStores' ya no es necesario
  // toggleAllStores(checked: boolean): void {
  //   const form = this.storesForm()
  //   if (!form) return
  //   this.allStoresSelected = checked
  //   Object.keys(form.controls).forEach(key => {
  //     form.get(key)?.setValue(checked)
  //   })
  // }
}