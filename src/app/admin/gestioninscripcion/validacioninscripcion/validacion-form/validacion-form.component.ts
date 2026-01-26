import { Component } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { Router } from "@angular/router";

@Component({
  selector: "app-validacion-form",
  imports: [MaterialModule],
  templateUrl: "./validacion-form.component.html",
  styleUrl: "./validacion-form.component.css",
})
export class ValidacionFormComponent {
  constructor(private router: Router) {}
  volver() {
    this.router.navigate(["/admin/inscripcion/validacioninscripcion"]);
  }
}
