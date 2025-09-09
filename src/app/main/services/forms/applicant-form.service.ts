import { Injectable, signal, WritableSignal } from "@angular/core";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { ApplicantFormGroup } from "../../models/forms/ApplicantForm";
import { emailDomainValidator } from "../../validators/email-domain.validator";

@Injectable({
  providedIn: "root"
})
export class ApplicantFormService {
  applicantForm: WritableSignal<ApplicantFormGroup>;

  constructor(private formBuilder: NonNullableFormBuilder) {
    const initialValue = this.formBuilder.group({
      name: this.formBuilder.control("", [Validators.required]),
      email: this.formBuilder.control("", [
        Validators.email,
        Validators.required,
        emailDomainValidator(["@equitel.com.co"]) // <-- Aquí está el cambio
      ]),
      observations: this.formBuilder.control("")
    });

    this.applicantForm = signal(initialValue);
  }
}
