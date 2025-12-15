import { Component, HostListener, inject, OnInit, TemplateRef } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { RouterLink } from "@angular/router";
import { CommonModule, DatePipe } from "@angular/common";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UbigeoService } from "../../../../services/ubigeo.service";
import { SedeService } from "../../../../services/sede.service";
import { Ubigeo } from "../../../../model/ubigeo";
import { Sede } from "../../../../model/sede.model";
import { DisciplinaService } from "../../../../services/disciplina.service";
import { Disciplina } from "../../../../model/disciplina.model";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { MatDialogRef } from "@angular/material/dialog";
import { DialogcustomComponent } from "../../../dialogcustom/dialogcustom.component";
import { ToastrService } from "ngx-toastr";
import { iif, map, Observable, startWith } from "rxjs";
import { Tipoturno } from "../../../../model/tipoturno.model";
import { Dias } from "../../../../model/dias.model";
import { DiasService } from "../../../../services/dias.service";
import { validarInput, ValidationType } from "../../../../util/validaciones.util";
import { CategoriaService } from "../../../../services/categoria.service";
import { TemporadaService } from "../../../../services/temporada.service";
import { Temporada } from "../../../../model/temporada.model";
import { Categoria } from "../../../../model/categoria.model";
import { Listadia, Turno } from "../../../../model/turno.model";
import { TurnoService } from "../../../../services/turno.service";
import { MatTableDataSource } from "@angular/material/table";
import { Horario } from "../../../../model/horario.model";

@Component({
  selector: "app-horarios-form",
  imports: [CommonModule, MaterialModule],
  templateUrl: "./horarios-form.component.html",
  styleUrl: "./horarios-form.component.css",
  providers: [DatePipe],
})
export class HorariosFormComponent implements OnInit {
  constructor(
    private formBuild: FormBuilder,
    private datePipe: DatePipe,
    private dialogService: DialogService,
    private toastrService: ToastrService
  ) {
    this.buildForm();
  }
  private ubigeoService = inject(UbigeoService);
  private sedeService = inject(SedeService);
  private disciplinaService = inject(DisciplinaService);
  private diasService = inject(DiasService);
  private categoriaService = inject(CategoriaService);
  private temporadaService = inject(TemporadaService);
  private turnoService = inject(TurnoService);

  private matDialogRef!: MatDialogRef<DialogcustomComponent>;

  horarioForm: FormGroup;
  complejoForm: FormGroup;
  disciplinaForm: FormGroup;

  turnosColumns: string[] = ["id", "dias", "horas", "accion"];
  dataTurnos = new MatTableDataSource<Turno>();

  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  sedes: Sede[] = [];
  disciplina: Disciplina[] = [];
  dias: Dias[] = [];
  temporada: Temporada[] = [];
  categoria: Categoria[] = [];
  turno: Turno[] = [];
  nomdep = "";
  nomprov = "";

  horas: string[] = [];
  horasFiltradasInicio!: Observable<string[]>;
  horasFiltradasFin!: Observable<string[]>;
  tipoturno: Tipoturno[] = [];
  turnoseleccionado: Turno | null = null;
  listaTurnos: Turno[] = [];

  private buildForm() {
    this.complejoForm = this.formBuild.group({
      departamento: ["", Validators.required],
      provincia: [""],
      sede: ["", Validators.required],
    });
    this.horarioForm = this.formBuild.group({
      // dias: ["", Validators.required],
      numvacante: ["", Validators.required],

      temporada: ["", Validators.required],
      categoria: ["", Validators.required],

      turno: ["", Validators.required],
    });
    this.disciplinaForm = this.formBuild.group({
      nombre: ["", Validators.required],
    });
  }
  ngOnInit(): void {
    this.diasService.findAll().subscribe((data) => (this.dias = data));
    this.disciplinaService.findAll().subscribe({
      next: (data) => {
        this.disciplina = data;
      },
      error: (err) => console.error(err),
    });
    this.ubigeoService.findAllDepartments().subscribe({
      next: (data) => {
        this.departamentos = data;
      },
      error: (err) => console.error(err),
    });
    this.temporadaService.findAll().subscribe((data) => (this.temporada = data));
    this.categoriaService.findAll().subscribe((data) => (this.categoria = data));
    this.turnoService.findAll().subscribe((data) => (this.turno = data));
  }
  @HostListener("window:beforeunload", ["$event"])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    const forms = [this.complejoForm, this.horarioForm];
    if (forms.some((f) => f?.dirty)) {
      event.preventDefault();
      event.returnValue = true;
    }
  }

  onDepartamentoChange(): void {
    if (this.complejoForm.get("departamento")?.value === undefined) {
      this.provincias = [];
      this.sedes = [];
      this.complejoForm.patchValue({ provincia: "", sede: "" });
      return;
    }
    console.log(this.complejoForm.get("departamento")?.value);
    const depId = this.complejoForm.get("departamento")?.value.ubiDpto;
    this.nomdep = this.complejoForm.get("departamento")?.value.ubiNombre;
    this.provincias = [];
    this.sedes = [];
    this.complejoForm.patchValue({ provincia: "", sede: "" });
    this.ubigeoService.findProvincias(depId).subscribe({
      next: (data) => {
        this.provincias = data;
      },
    });
    this.sedeService.getSedexubicacion(this.nomdep).subscribe((data) => (this.sedes = data));
  }
  onProvinciaChange() {
    if (this.complejoForm.get("provincia")?.value === undefined) {
      this.sedes = [];
      this.complejoForm.patchValue({ sede: "" });
      return;
    }
    this.nomprov = this.complejoForm.get("provincia")?.value.ubiNombre;
    this.sedes = [];
    this.complejoForm.patchValue({ sede: "" });
    this.sedeService.getSedexubicacion(`${this.nomdep}/${this.nomprov}`).subscribe((data) => (this.sedes = data));
  }

  guardarHorario() {
    const datahorario: Horario = {
      numVacante: Number(this.horarioForm.get("numvacante")!.value),
      contador: Number(this.horarioForm.get("numvacante")!.value),
      usuarioCrea: "1",
      fechaCrea: String(this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")),
      usuarioModifica: null,
      fechaModifica: null,
      estado: "1",
      turno: {
        idTurno: Number(this.listaTurnos.map((d) => d.idTurno)[0]),
      },
      listadisciplina: {
        estado: "1",
        sede: {
          idSede: Number(this.complejoForm.get("sede")!.value.idSede),
        },
        disciplina: {
          idDisciplina: Number(this.panels.map((d) => d.idDisciplina)[0]),
        },
      },
      temporada: {
        idTemporada: Number(this.horarioForm.get("temporada")!.value.idTemporada),
      },
      categoriaedad: {
        idCategoriaedad: Number(this.horarioForm.get("categoria")!.value.idCategoriaedad),
      },
    };
    console.log(datahorario);
  }
  limpiarFormulario() {}

  /* Modales */
  openModal(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogCustom({
      template,
    });
    this.matDialogRef.afterClosed().subscribe(() => {
      this.disciplinaForm.reset();
      this.horarioForm.reset();
      this.listaTurnos = [];
      this.dataTurnos.data = [...this.listaTurnos];
    });
  }

  /* Para agregar disciplinas */
  panels: any[] = [];
  expandedIndex: number | null = null;
  idDisciplina = 0;

  addPanel() {
    const data = this.disciplinaForm.get("nombre")!.value;

    if (this.panels.length !== 0) {
      // this.panels.push({ data });
      const existeDisciplina = this.panels.find((d) => d.data.idDisciplina === data.idDisciplina);
      if (existeDisciplina) {
        this.toastrService.error("Ya existe esta disciplina", "Error", { timeOut: 3200, progressBar: true });
        return;
      }
      this.panels.push({ data });
    } else {
      this.panels.push({ data });
      console.log(data);
    }
    this.matDialogRef.close();
  }

  togglePanel(index: number, disciplina: Disciplina) {
    this.idDisciplina = disciplina.idDisciplina;
    console.log(`esta habierto ${this.idDisciplina}`);
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
  mostrarTurnos(turno: Turno): string {
    const dias = turno.listadia.map((d) => d.dias.descripcion).join(" - ");
    const tipo = turno.tipoturno.descripcion;
    return `${dias}   (${tipo} ${turno.horainicio.slice(0, 5)} a ${turno.horafin.slice(0, 5)})`;
  }

  mostrarDias(dias: Listadia[]): string {
    return dias.map((d) => d.dias.descripcion).join(", ");
  }

  /*TURNOS*/

  agregarTurnos(e: Event) {
    e.preventDefault();
    console.log(this.turnoseleccionado);
    if (this.turnoseleccionado) {
      this.listaTurnos.push(this.turnoseleccionado);
      this.dataTurnos.data = [...this.listaTurnos];
      this.turnoseleccionado = null;
    }
  }
  deleteTurno(turno: Turno, e: Event) {
    e.preventDefault();
    this.listaTurnos = this.listaTurnos.filter((data) => data !== turno);
    this.dataTurnos.data = [...this.listaTurnos];
  }
  esDeshabilitado(turno: Turno): boolean {
    return this.listaTurnos.includes(turno);
  }

  soloNumeros(event: KeyboardEvent, type: ValidationType) {
    validarInput(event, type);
  }
  tabIndex = 0;

  nextTab() {
    this.tabIndex++;
  }

  prevTab() {
    this.tabIndex--;
  }
}
