import { Injectable } from "@angular/core"
import { BasicDataFormGroup, BasicDataFormModel } from "../../models/forms/BasicData"
import { NonNullableFormBuilder, Validators } from "@angular/forms" // Asegúrate de que NonNullableFormBuilder esté importado
import { emailDomainValidator } from "../../validators/email-domain.validator"

@Injectable({
  providedIn: "root"
})
export class BasicDataFormService {
  basicDataForm: BasicDataFormGroup

  formControls: BasicDataFormModel = {
    docId: this.formBuilder.control("", [Validators.required, Validators.pattern(/[0-9]+/)]),
    name: this.formBuilder.control("", [Validators.required]),
    lastName: this.formBuilder.control("", [Validators.required]),
    phoneNumber: this.formBuilder.control("", [Validators.required, Validators.pattern(/[0-9]+/), Validators.minLength(10), Validators.maxLength(10)]),
    email: this.formBuilder.control("", [Validators.required, Validators.email, emailDomainValidator("@equitel.com.co")]),
    // --- Agrega el control para 'isTechnician' aquí ---
    isTechnician: this.formBuilder.control(false), // Valor inicial: false (desmarcado)
    // --------------------------------------------------
    operationCenter: this.formBuilder.control("", [Validators.required]),
    position: this.formBuilder.control("", [Validators.required]),
    previousUser: this.formBuilder.control("", [Validators.required]),
    company: this.formBuilder.control("", [Validators.required]),
    unitDeal: this.formBuilder.control("", [Validators.required]),
    costCenter: this.formBuilder.control("", [Validators.required]),
    profile: this.formBuilder.control(""),
  }

  constructor(private formBuilder: NonNullableFormBuilder) {
    this.basicDataForm = this.formBuilder.group(this.formControls)
  }
}