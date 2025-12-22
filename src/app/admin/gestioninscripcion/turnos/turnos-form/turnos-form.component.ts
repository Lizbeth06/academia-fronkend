import { Component, inject, Input, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { MaterialModule } from "../../../../material/material.module";
import { TipoturnoService } from "../../../../services/tipoturno.service";
import { Tipoturno } from "../../../../model/tipoturno.model";
import { map, Observable, startWith } from "rxjs";
import { CommonModule } from "@angular/common";
import { Listadia, Turno } from "../../../../model/turno.model";
import { TurnoService } from "../../../../services/turno.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { TurnosListaComponent } from "../turnos-lista/turnos-lista.component";
import { Dias } from "../../../../model/dias.model";
import { DiasService } from "../../../../services/dias.service";

@Component({
  selector: "app-turnos-form",
  imports: [MaterialModule, CommonModule],
  templateUrl: "./turnos-form.component.html",
  styleUrl: "./turnos-form.component.css",
})
export class TurnosFormComponent implements OnInit {
  estado = [
    { id: 1, estado: "ACTIVO" },
    { id: 0, estado: "INACTIVO" },
  ];

  constructor(private formBuilder: FormBuilder, private toastrService: ToastrService, private router: Router) {
    this.buildForm();
  }
  private tipoturnoService = inject(TipoturnoService);
  private turnoService = inject(TurnoService);
  private formLista = inject(TurnosListaComponent);
  private diasServicio = inject(DiasService);

  turnoForm: FormGroup;

  horaInicioControl = new FormControl("");
  horaFinControl = new FormControl("");

  cargar = false;
  idTurno = 0;
  horas: string[] = [];
  horasFiltradasInicio!: Observable<string[]>;
  horasFiltradasFin!: Observable<string[]>;
  tipoturno: Tipoturno[] = [];
  dias: Dias[] = [];

  listadias: Listadia[] = [];

  private buildForm() {
    this.turnoForm = this.formBuilder.group(
      {
        turno: [1, Validators.required],
        horainicio: ["", [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
        horafin: ["", [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
        dias: ["", Validators.required],
        // estado: [1, Validators.required],
      },
      { validators: this.validarHoras.bind(this) }
    );
  }
  ngOnInit(): void {
    this.diasServicio.findAll().subscribe((data) => (this.dias = data));
    this.tipoturnoService.findAll().subscribe((data: any) => {
      this.tipoturno = data;
      console.log(data);
    });

    this.generarHoras();
    this.horasFiltradasInicio = this.turnoForm.get("horainicio")!.valueChanges.pipe(
      startWith(""),
      map((value) => this._filtrarHoras(value || ""))
    );
    this.horasFiltradasFin = this.turnoForm.get("horafin")!.valueChanges.pipe(
      startWith(""),
      map((value) => this._filtrarHoras(value || ""))
    );
  }
  editarTurno(id: Number) {
    this.idTurno = Number(id);
    this.turnoService.findById(Number(id)).subscribe({
      next: (data) => {
        this.turnoForm.get("turno")?.setValue(data.tipoturno.idTipoturno),
          this.turnoForm.get("horainicio")?.setValue(data.horainicio.slice(0, 5)),
          this.turnoForm.get("horafin")?.setValue(data.horafin.slice(0, 5));
        this.turnoForm.get("estado")?.setValue(Number(data.estado));
        this.turnoForm.get("dias")?.setValue(this.dias.filter((d) => data.listadia.some((g) => g.dias.idDias === d.idDias)));
      },
      error: (error) => {
        this.cargar = false;
        this.toastrService.error(error.error.value[0].message, "Error al cargar datos", { timeOut: 3200 });
      },
    });
  }
  guardarTurno(event: MouseEvent) {
    this._listarDias();
    const turno: Turno = {
      horainicio: String(this.turnoForm.get("horainicio")!.value.trim() + ":00").trim(),
      horafin: String(this.turnoForm.get("horafin")!.value.trim() + ":00").trim(),
      estado: "1",
      tipoturno: {
        idTipoturno: Number(this.turnoForm.get("turno")!.value),
      },
      listadia: this.listadias,
    };
    if (this.idTurno !== 0) {
      this.turnoService.update(this.idTurno, turno).subscribe({
        next: () => {
          this.toastrService.success("Se actualizaron los datos correctamente.", "Exitoso", { timeOut: 3200 });
          this.cargar = false;
          this.limpiarFormulario(event);
          this.formLista.getAllSede();
          this.listadias = [];
        },
        error: (error) => {
          this.listadias = [];
          this.cargar = false;
          this.toastrService.error(error.error.value[0].message, "Error al actualizar", { timeOut: 3200 });
        },
      });
    } else {
      this.turnoService.save(turno).subscribe({
        next: (response: any) => {
          this.listadias = [];
          this.cargar = false;
          if (!response.hasSucceeded) {
            this.toastrService.error(response.value.message, "Error en guardar", { timeOut: 3200 });
            return;
          }
          this.toastrService.success("Se guardaron los datos correctamente.", "Exitoso", { timeOut: 3200 });
          this.limpiarFormulario(event);
          this.formLista.getAllSede();
        },
        error: (error) => {
          this.listadias = [];
          this.cargar = false;
          this.toastrService.error(error.error.value[0].message, "Error en guardar", { timeOut: 3200 });
        },
      });
    }
  }
  private _listarDias() {
    const data = this.turnoForm.get("dias")?.value;
    data.forEach((dia: Dias) => {
      const lista: Listadia = {
        estado: "1",
        dias: {
          idDias: dia.idDias,
        },
      };
      this.listadias.push(lista);
    });
  }
  limpiarFormulario(e: MouseEvent) {
    e.preventDefault();
    this.turnoForm.reset();
    this.idTurno = 0;
    Object.values(this.turnoForm.controls).forEach((control) => {
      control.markAsPristine();
      control.markAsUntouched();
    });
  }

  /* Para hora*/
  public validarHoras(group: AbstractControl) {
    const inicio = group.get("horainicio")?.value;
    const fin = group.get("horafin")?.value;

    if (!inicio || !fin) return null;

    const inicioMin = this.toMin(inicio);
    const finMin = this.toMin(fin);

    const horafinControl = group.get("horafin");

    if (finMin <= inicioMin) {
      horafinControl?.setErrors({ horaInvalida: true });
    } else {
      // Limpiar error si ya no aplica
      if (horafinControl?.hasError("horaInvalida")) {
        horafinControl.setErrors(null);
      }
    }

    return null;
  }

  private toMin(hora: string): number {
    const [h, m] = hora.split(":").map((x) => +x);
    return h * 60 + m;
  }

  private generarHoras() {
    this.horas = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const horaStr = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
        this.horas.push(horaStr);
      }
    }
  }
  private _filtrarHoras(value: string): string[] {
    if (!value) return this.horas;
    const normalizado = value.length === 1 ? value.padStart(2, "0") : value;
    return this.horas.filter((h) => h.startsWith(normalizado));
  }

  soloNumerosYPunto(event: KeyboardEvent) {
    const allowed = /[0-9:]/;
    if (!allowed.test(event.key)) event.preventDefault();
  }

  amPmHora(valor: string | null | undefined): string {
    if (!valor) return "";
    const partes = valor.split(":");
    if (partes.length !== 2) return "";
    const hora = parseInt(partes[0]);
    if (isNaN(hora)) return "";
    return hora >= 12 ? "PM" : "AM";
  }

  formatearHora(event: any, controlName: string) {
    let v = event.target.value.replace(/\D/g, "");
    if (v.length <= 2) {
      this.turnoForm.get(controlName)?.setValue(v, { emitEvent: true });
      return;
    }
    this.turnoForm.get(controlName)?.setValue(v.slice(0, 2) + ":" + v.slice(2, 4), { emitEvent: true });
  }
}
