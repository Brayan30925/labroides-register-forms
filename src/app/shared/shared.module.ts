import {NgModule} from "@angular/core"
import {CommonModule} from "@angular/common"
import {FormsModule, ReactiveFormsModule} from "@angular/forms"
import {provideHttpClient} from "@angular/common/http"

@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers: [
        provideHttpClient()
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class SharedModule {
}
