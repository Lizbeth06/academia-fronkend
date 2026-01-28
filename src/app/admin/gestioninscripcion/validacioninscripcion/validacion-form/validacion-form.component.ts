import { Component, inject, OnInit } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { Router } from "@angular/router";
import { InscripcionService } from "../../../../services/inscripcion.service";
import { DataService } from "../../../../services/data.service";
import { Inscripcion } from "../../../../model/inscripcion.model";
import { Turno } from "../../../../model/horario.model";

@Component({
  selector: "app-validacion-form",
  imports: [MaterialModule],
  templateUrl: "./validacion-form.component.html",
  styleUrl: "./validacion-form.component.css",
})
export class ValidacionFormComponent implements OnInit {
  constructor(private router: Router) {}
  private inscripcionService = inject(InscripcionService);
  private dataService = inject(DataService);

  idIsncripcion = 0;
  datosParticipante: Inscripcion;

  ngOnInit(): void {
    this.dataService.data.subscribe({
      next: (data) => {
        this.idIsncripcion = data;
      },
    });
    if (this.idIsncripcion !== 0) {
      this.inscripcionService.findById(this.idIsncripcion).subscribe({
        next: (data) => {
          this.datosParticipante = data;
          console.log(data);
        },
      });
    }
  }
  generarDocumentos(tipodocumento?: string) {
    if (tipodocumento === "declaracion") {
      this.inscripcionService.generarDeclaracionJurada(this.idIsncripcion).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));

          window.open(url, "_blank");
        },
      });
    } else if (tipodocumento === "ficha") {
      this.inscripcionService.generarFichaPreInscripcion(this.idIsncripcion).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));

          window.open(url, "_blank");
        },
      });
    } else {
      this.inscripcionService.generarCarnetDigital(this.idIsncripcion).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));

          window.open(url, "_blank");
        },
      });
    }
  }
  mostrarTiempo(turno: Turno): string {
    const dias = turno.listadia!.map((d) => d.dias!.codigo).join(" - ");
    return `${dias} ${turno.horainicio!.slice(0, -3)} - ${turno.horafin!.slice(0, -3)} ${turno.tipoturno!.descripcion}`;
  }
  volver() {
    this.router.navigate(["/admin/inscripcion/validacioninscripcion"]);
  }
}
