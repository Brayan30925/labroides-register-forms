import { Component, computed } from "@angular/core"
import { CommonModule } from "@angular/common"
// Eliminamos las importaciones de MatDialog que no se usan
import { MatButtonModule } from "@angular/material/button"
import { MatInputModule } from "@angular/material/input"
import { ApplicantFormService } from "../../services/forms/applicant-form.service"
import { ReactiveFormsModule } from "@angular/forms"

@Component({
    selector: "app-register-responsible-form",
    // ¡Se han eliminado MatDialogContent, MatDialogTitle, MatDialogClose y MatDialogActions!
    imports: [CommonModule, MatButtonModule, MatInputModule, ReactiveFormsModule],
    templateUrl: "./register-responsible-form.component.html",
    styleUrl: "./register-responsible-form.component.sass"
})
export class RegisterResponsibleFormComponent {
  registerResponsibleForm = this.registerResponsibleService.applicantForm
  formControls = computed(() => this.registerResponsibleForm().controls)

  public constructor(private registerResponsibleService: ApplicantFormService) { }
}