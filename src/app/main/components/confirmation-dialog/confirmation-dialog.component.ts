import { Component, Inject } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"

interface DialogData {
  message: string
}

@Component({
    selector: 'app-confirmation-dialog',
    imports: [CommonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatDialogClose],
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.sass'
})
export class ConfirmationDialogComponent {

  public constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
