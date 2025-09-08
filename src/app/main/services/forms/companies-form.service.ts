import { computed, Injectable, Signal, signal, WritableSignal } from "@angular/core"
import { Company } from "../../models/dto/Company"
import { EquitelService } from "../api/equitel.service"
import { NonNullableFormBuilder } from "@angular/forms"
import { atLeastOneItemSelectedValidator } from '../../validators/at-least-one-item-selected.validator'
import { CheckBoxForm, CheckBoxFormGroup } from '../../models/forms/CheckBoxForm'

@Injectable({
  providedIn: "root"
})
export class CompaniesFormService {
  companies: WritableSignal<Company[]>
  companiesForm: Signal<CheckBoxFormGroup>

  constructor(private formBuilder: NonNullableFormBuilder, private equitelService: EquitelService) {
    this.companies = signal([])

    this.companiesForm = computed(() => {
      const forms: CheckBoxForm = {}
      this.companies().forEach((c) => forms[c.nit] = this.formBuilder.control(false))
      return this.formBuilder.group(forms, { validators: [atLeastOneItemSelectedValidator()] })
    })

    this.equitelService.getAllCompanies().subscribe({ next: (c) => this.companies.set(c) })
  }
}
