import { bootstrapApplication } from "@angular/platform-browser"
import { provideAnimations } from "@angular/platform-browser/animations"
import { ApplicationConfig } from "@angular/core"
import { AppComponent } from "./app/app.component"
import { provideHttpClient } from "@angular/common/http"

const options: ApplicationConfig = {
  providers: [provideAnimations(), provideHttpClient()]
}

bootstrapApplication(AppComponent, options).catch()

