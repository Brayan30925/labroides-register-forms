import { Injectable } from "@angular/core";
import { BasicDataFormGroup } from "../../models/forms/BasicData";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { emailDomainValidator } from "../../validators/email-domain.validator";
import { noWhitespaceValidator } from "../../validators/no-whitespace.validator";

@Injectable({
  providedIn: "root",
})
export class BasicDataFormService {
  // Se ha cambiado a un tipo WritableSignal, ya que es la forma moderna de usar signals
  // y se inicializa en el constructor.
  basicDataForm: BasicDataFormGroup;

  constructor(private formBuilder: NonNullableFormBuilder) {
    this.basicDataForm = this.createForm();
  }

  private createForm(): BasicDataFormGroup {
    return this.formBuilder.group({
      docId: this.formBuilder.control("", [
        Validators.required,
        Validators.pattern(/[0-9]+/),
      ]),
      name: this.formBuilder.control("", [
        Validators.required,
        noWhitespaceValidator(),
      ]),
      lastName: this.formBuilder.control("", [
        Validators.required,
        noWhitespaceValidator(),
      ]),
      phoneNumber: this.formBuilder.control("", [
        Validators.required,
        Validators.pattern(/[0-9]+/),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
      email: this.formBuilder.control("", [
        Validators.required,
        Validators.email,
        emailDomainValidator([
          "@equitel.com.co",
          "@gmail.com",
          "@hotmail.com",
          "@outlook.com",
          "@yahoo.com",
        ]),
      ]),
      isTechnician: this.formBuilder.control(false),
      operationCenter: this.formBuilder.control("", [Validators.required]),
      position: this.formBuilder.control("", [
        Validators.required,
        noWhitespaceValidator(),
      ]),
      previousUser: this.formBuilder.control("", [
        Validators.required,
        noWhitespaceValidator(),
      ]),
      company: this.formBuilder.control("", [Validators.required]),
      unitDeal: this.formBuilder.control("", [Validators.required]),
      costCenter: this.formBuilder.control("", [Validators.required]),
      profile: this.formBuilder.control(""),
    }) as BasicDataFormGroup; // Se añade una aserción de tipo para compatibilidad
  }
}