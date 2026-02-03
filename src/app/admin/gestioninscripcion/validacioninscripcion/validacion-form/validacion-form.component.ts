import { Component, inject, OnInit, TemplateRef } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { Router } from "@angular/router";
import { InscripcionService } from "../../../../services/inscripcion.service";
import { DataService } from "../../../../services/data.service";
import { Inscripcion } from "../../../../model/inscripcion.model";
import { Turno } from "../../../../model/horario.model";
import { ToastrService } from "ngx-toastr";
import { DialogcustomComponent } from "../../../dialogcustom/dialogcustom.component";
import { MatDialogRef } from "@angular/material/dialog";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { Validacioninscripcion, ValidacioninscripcionSave } from "../../../../model/validacioninscripcion.model";
import { ValidacioninscripcionService } from "../../../../services/validacioninscripcion.service";

@Component({
  selector: "app-validacion-form",
  imports: [MaterialModule],
  templateUrl: "./validacion-form.component.html",
  styleUrl: "./validacion-form.component.css",
})
export class ValidacionFormComponent implements OnInit {
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private dialogService: DialogService,
  ) {}
  private inscripcionService = inject(InscripcionService);
  private validacioninscripcionService = inject(ValidacioninscripcionService);
  private dataService = inject(DataService);
  private matDialogRef!: MatDialogRef<DialogcustomComponent>;

  idInscripciondelete: number = 0;
  idIsncripcion = 0;
  datosParticipante: Inscripcion;
  dataValidacion: Inscripcion;
  loading = true;

  ngOnInit(): void {
    this.dataService.data.subscribe({
      next: (id) => {
        if (id && id !== 0) {
          this.inscripcionService.findById(id).subscribe({
            next: (data) => {
              this.datosParticipante = data;
              this.loading = false;
            },
            error: () => {
              this.loading = false;
            },
          });
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
      },
    });
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

  anularInscripcion() {
    this.inscripcionService.anularPreinscripcion(this.idInscripciondelete).subscribe({
      next: () => {
        this.matDialogRef.close();
        this.router.navigate(["/admin/inscripcion/validacioninscripcion"]);
        this.toastrService.success("Preinscripción eliminada correctamente", "Exitoso");
        this.idInscripciondelete = 0;
      },
      error: () => {
        this.matDialogRef.close();
        this.router.navigate(["/admin/inscripcion/validacioninscripcion"]);
        this.toastrService.error("Error al eliminar la preinscripción", "Error");
        this.idInscripciondelete = 0;
      },
    });
  }

  validarInscripcion() {
    const validacion: ValidacioninscripcionSave = {
      usuariocrea: "1",
      fechacreada: String(new Date().toISOString()),
      estado: "1",
      inscripcion: { idInscripcion: Number(this.dataValidacion.idInscripcion) },
    };
    this.validacioninscripcionService.saveValidacioninscripcion(validacion).subscribe({
      next: () => {
        this.matDialogRef.close();
        this.toastrService.success("Inscripción validada correctamente", "Exitoso");
      },
      error: () => {
        this.matDialogRef.close();
        this.toastrService.error("Error al validar la inscripción", "Error");
      },
    });
  }

  modalEliminarpreinscripcion(template: TemplateRef<any>, id: Number) {
    console.log(id);
    this.idInscripciondelete = Number(id);
    this.matDialogRef = this.dialogService.openDialogCustom({
      template,
    });
  }
  modalValidarinscripcion(template: TemplateRef<any>, inscripcion: Inscripcion) {
    this.dataValidacion = inscripcion;
    this.matDialogRef = this.dialogService.openDialogCustom({
      template,
    });
  }
}
