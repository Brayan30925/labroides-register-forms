import { computed, effect, Injectable, Signal, signal, WritableSignal } from "@angular/core"
import { NonNullableFormBuilder } from "@angular/forms"
import { HttpErrorResponse } from '@angular/common/http'
import { combineLatest, map, of, switchMap } from 'rxjs'

import { EquitelService } from "../api/equitel.service"
import { CompaniesFormService } from './companies-form.service'
import { OperationCentersFormService } from './operation-centers-form.service'
import { atLeastOneItemSelectedValidator } from '../../validators/at-least-one-item-selected.validator'

import { Store } from "../../models/dto/Store"
import { CheckBoxForm, CheckBoxSet, CheckBoxFormGroup } from '../../models/forms/CheckBoxForm'

@Injectable({
  providedIn: "root"
})
export class StoresFormService {
  stores: WritableSignal<Store[]>
  storesForm: Signal<CheckBoxFormGroup>

  getCheckBoxFormSelectedItems = (formsValues: Partial<CheckBoxSet>[]) => formsValues.map(formValue => Object.keys(formValue).filter(i => formValue[i]))

  fetchStores = ([companies, operationCenters]: string[][]) => companies.length !== 0 && operationCenters.length !== 0 ? this.equitelService.getStoresForRegistration(companies, operationCenters) : of([]);

  constructor(formBuilder: NonNullableFormBuilder, private companiesService: CompaniesFormService, private operationCentersService: OperationCentersFormService, private equitelService: EquitelService) {
    this.stores = signal([])

    this.storesForm = computed(() => {
      const storesFormGroup = formBuilder.group<CheckBoxForm>({}, { validators: [atLeastOneItemSelectedValidator()] })
      const addFormControl = (store: Store) => storesFormGroup.addControl(store.idStore, formBuilder.control(false))
      this.stores().forEach(addFormControl)
      return storesFormGroup
    })

    const configUpdateStoresFn = () => {
      combineLatest<Partial<CheckBoxSet>[]>([this.companiesService.companiesForm().valueChanges, this.operationCentersService.operationCentersForm().valueChanges])
        .pipe(map(this.getCheckBoxFormSelectedItems.bind(this)))
        .pipe(switchMap(this.fetchStores.bind(this)))
        .subscribe({
          next: (stores: Store[]) => this.stores.set(stores),
          error: (error: HttpErrorResponse) => console.error(error.message)
        })
    }

    effect(configUpdateStoresFn, { allowSignalWrites: true })
  }
}

