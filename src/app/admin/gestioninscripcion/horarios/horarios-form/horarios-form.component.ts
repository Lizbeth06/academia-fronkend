import { Component, inject, OnInit } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UbigeoService } from "../../../../services/ubigeo.service";
import { SedeService } from "../../../../services/sede.service";
import { Ubigeo } from "../../../../model/ubigeo";
import { Sede } from "../../../../model/sede.model";

@Component({
  selector: "app-horarios-form",
  imports: [CommonModule, MaterialModule],
  templateUrl: "./horarios-form.component.html",
  styleUrl: "./horarios-form.component.css",
})
export class HorariosFormComponent implements OnInit {
  constructor(private formBuild: FormBuilder) {
    this.buildForm();
  }
  private ubigeoService = inject(UbigeoService);
  private sedeService = inject(SedeService);

  horarioForm: FormGroup;
  complejoForm: FormGroup;

  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  sedes: Sede[] = [];
  nomdep = "";
  nomprov = "";

  private buildForm() {
    this.complejoForm = this.formBuild.group({
      departamento: ["", Validators.required],
      provincia: [""],
      sede: ["", Validators.required],
    });
    this.horarioForm = this.formBuild.group({
      turno: ["", Validators.required],
      disciplina: ["", Validators.required],
      categoria: ["", Validators.required],
      temporada: ["", Validators.required],
      contador: [0, Validators.required],
      numVacante: [0, Validators.required],
      estado: ["Activo", Validators.required],
    });
  }
  ngOnInit(): void {
    this.ubigeoService.findAllDepartments().subscribe({
      next: (data) => {
        this.departamentos = data;
      },
      error: (err) => console.error(err),
    });
  }

  onDepartamentoChange(): void {
    const depId = this.complejoForm.get("departamento")?.value.ubiDpto;
    this.nomdep = this.complejoForm.get("departamento")?.value.ubiNombre;
    this.provincias = [];
    this.sedes = [];
    this.complejoForm.patchValue({ provincia: "", sede: "" });
    this.ubigeoService.findProvinciasByDepartments(depId).subscribe({
      next: (data) => {
        this.provincias = data;
      },
    });
    this.sedeService.getSedexubicacion(this.nomdep).subscribe((data) => (this.sedes = data));
  }
  onProvinciaChange() {
    this.nomprov = this.complejoForm.get("provincia")?.value.ubiNombre;
    this.sedes = [];
    this.sedeService.getSedexubicacion(`${this.nomdep}/${this.nomprov}`).subscribe((data) => (this.sedes = data));
  }

  guardarHorario() {}
  limpiarFormulario() {}
}
