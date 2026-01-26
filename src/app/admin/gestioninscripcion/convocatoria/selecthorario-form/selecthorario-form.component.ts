import { Component, EventEmitter, inject, OnInit, Output } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SedeService } from "../../../../services/sede.service";
import { UbigeoService } from "../../../../services/ubigeo.service";
import { Ubigeo } from "../../../../model/ubigeo.model";
import { Sede } from "../../../../model/sede.model";
import { Horario, Modalidad } from "../../../../model/horario.model";
import { HorarioService } from "../../../../services/horario.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-selecthorario-form",
  imports: [MaterialModule],
  templateUrl: "./selecthorario-form.component.html",
  styleUrl: "./selecthorario-form.component.css",
})
export class SelecthorarioFormComponent implements OnInit {
  constructor(
    private formBuild: FormBuilder,
    private toastrService: ToastrService,
  ) {
    this.buildForm();
  }
  @Output() horariosSeleccionados = new EventEmitter<Horario[]>();
  private sedeService = inject(SedeService);
  private ubigeoService = inject(UbigeoService);
  private horarioService = inject(HorarioService);

  depId = "";
  nomdep = "";
  nomprov = "";

  dataHorarios: Horario[] = [];
  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];
  sedes: Sede[] = [];
  modalidad: Modalidad[] = [];

  listaHorarios: Horario[] = [];
  filtroForm: FormGroup;

  private buildForm() {
    this.filtroForm = this.formBuild.group({
      departamento: ["", Validators.required],
      provincia: ["", Validators.required],
      distrito: ["", Validators.required],
      sede: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.ubigeoService.findAllDepartments().subscribe((data) => (this.departamentos = data));
  }

  onDepartamentoChange(tipoForm?: string): void {
    this.depId = this.filtroForm.get("departamento")?.value.ubiDpto;
    this.nomdep = this.filtroForm.get("departamento")?.value.ubiNombre;
    this.filtroForm.patchValue({ provincia: "", sede: "", distrito: "" });
    this.provincias = [];
    this.distritos = [];
    this.sedes = [];
    this.dataHorarios = [];
    this.horariosSeleccionados.emit(this.dataHorarios);

    this.ubigeoService.findProvincias(this.depId).subscribe({
      next: (data) => {
        this.provincias = data;
      },
    });
  }
  onProvinciaChange() {
    const provId = this.filtroForm.get("provincia")?.value.ubiProvincia;
    this.nomprov = this.filtroForm.get("provincia")?.value.ubiNombre;
    this.filtroForm.patchValue({ distrito: "", sede: "" });
    this.sedes = [];
    this.distritos = [];
    this.dataHorarios = [];
    this.horariosSeleccionados.emit(this.dataHorarios);

    this.ubigeoService.findDistritos(this.depId, provId).subscribe({
      next: (data) => {
        this.distritos = data;
      },
    });
  }
  onDistritoChange() {
    const nomdist = this.filtroForm.get("distrito")?.value.ubiNombre;
    this.filtroForm.patchValue({ sede: "" });
    this.sedes = [];
    this.dataHorarios = [];
    this.horariosSeleccionados.emit(this.dataHorarios);

    this.sedeService.getSedexubicacion(`${this.nomdep}/${this.nomprov}/${nomdist}`).subscribe((data) => {
      this.sedes = data;
    });
  }
  onSedeChange() {
    const idSede = this.filtroForm.get("sede")!.value;
    this.horarioService.getHorarioxsede(idSede).subscribe({
      next: (data) => {
        this.dataHorarios = data;
        this.horariosSeleccionados.emit(this.dataHorarios);
        if (this.dataHorarios.length === 0) {
          this.toastrService.warning("Agregar un horario a la sede", "!Importante¡", { timeOut: 3200, progressBar: true });
        }
      },
    });
  }
  resetFormulario() {
    this.filtroForm.reset();
  }
}
