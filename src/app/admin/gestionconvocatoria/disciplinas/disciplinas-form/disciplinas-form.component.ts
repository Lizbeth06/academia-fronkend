import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MaterialModule } from "../../../../material/material.module";

@Component({
  selector: "app-disciplinas-form",
  imports: [MaterialModule],
  templateUrl: "./disciplinas-form.component.html",
  styleUrl: "./disciplinas-form.component.css",
})
export class DisciplinasFormComponent implements OnInit {
  constructor(private formBuild: FormBuilder) {
    this.buildForm();
  }
  disciplinaForm!: FormGroup;

  buildForm() {
    this.disciplinaForm = this.formBuild.group({
      codigo: [""],
      descripcion: [""],
      estado: [""],
    });
  }

  ngOnInit(): void {}

  guardar() {}
  limpiar() {}
}
