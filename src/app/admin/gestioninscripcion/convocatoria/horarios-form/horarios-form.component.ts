import { Component, HostListener, inject, Input, OnInit } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { CommonModule, DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { validarInput, ValidationType } from "../../../../util/validaciones.util";
import { Temporada } from "../../../../model/temporada.model";
import { Listadia, Turno } from "../../../../model/turno.model";
import { MatTableDataSource } from "@angular/material/table";
import { Horario, Modalidad, Nivel } from "../../../../model/horario.model";
import { Categoriaedad } from "../../../../model/categoriaedad.model";
import { DialogcustomComponent } from "../../../dialogcustom/dialogcustom.component";
import { MatDialogRef } from "@angular/material/dialog";
import { DiasService } from "../../../../services/dias.service";
import { CategoriaedadService } from "../../../../services/categoriaedad.service";
import { TemporadaService } from "../../../../services/temporada.service";
import { TurnoService } from "../../../../services/turno.service";
import { HorarioService } from "../../../../services/horario.service";
import { Dias } from "../../../../model/dias.model";
import { ToastrService } from "ngx-toastr";
import { NivelService } from "../../../../services/nivel.service";
import { ModalidadService } from "../../../../services/modalidad.service";
import { ConvocatoriaFormComponent } from "../convocatoria-form/convocatoria-form.component";

@Component({
  selector: "app-horarios-form",
  imports: [CommonModule, MaterialModule],
  templateUrl: "./horarios-form.component.html",
  styleUrl: "./horarios-form.component.css",
  providers: [DatePipe],
})
export class HorariosFormComponent implements OnInit {
  constructor(private formBuild: FormBuilder, private toastrService: ToastrService, private datePipe: DatePipe) {}
  @Input() dialogData!: {
    idSede: number;
    idDisciplina: number;
    idEditHorario: number;
  };
  private diasService = inject(DiasService);
  private categoriaedadService = inject(CategoriaedadService);
  private temporadaService = inject(TemporadaService);
  private turnoService = inject(TurnoService);
  private horarioService = inject(HorarioService);
  private modalidadService = inject(ModalidadService);
  private nivelService = inject(NivelService);
  private listaHorario = inject(ConvocatoriaFormComponent);
  private matDialogRef!: MatDialogRef<DialogcustomComponent>;

  horarioForm: FormGroup;

  turnosColumns: string[] = ["id", "dias", "horas", "accion"];
  dataTurnos = new MatTableDataSource<Turno>();

  temporada: Temporada[] = [];
  categoria: Categoriaedad[] = [];
  modalidad: Modalidad[] = [];
  dias: Dias[] = [];
  nivel: Nivel[] = [];
  turno: Turno[] = [];
  listaTurnos: Turno[] = [];

  idEditHorario = 0;
  idDisciplina = 0;
  idSede = 0;
  turnoseleccionado: Turno | null = null;

  contador = 0;
  usuariocrea = "";
  fechacreada = "";

  private buildForm() {
    this.horarioForm = this.formBuild.group({
      numpreiscripcion: ["", Validators.required],
      numvacante: ["", Validators.required],

      modalidad: ["", Validators.required],
      nivel: ["", Validators.required],
      temporada: ["", Validators.required],
      categoria: ["", Validators.required],
      turno: [""],
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.modalidadService.findAll().subscribe((data) => (this.modalidad = data));
    this.nivelService.findAll().subscribe((data) => (this.nivel = data));
    this.diasService.findAll().subscribe((data) => (this.dias = data));
    this.temporadaService.findAll().subscribe((data) => (this.temporada = data));
    this.categoriaedadService.findAll().subscribe((data) => (this.categoria = data));
    this.turnoService.findAll().subscribe((data) => (this.turno = data));
    // this.idDisciplina = Number(localStorage.getItem("idDisciplina"));
    if (this.dialogData.idEditHorario !== 0) {
      console.log(this.dialogData.idEditHorario);
      this.editarHorario();
    }
  }

  @HostListener("window:beforeunload", ["$event"])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    const forms = [this.horarioForm];
    if (forms.some((f) => f?.dirty)) {
      event.preventDefault();
      event.returnValue = true;
    }
  }
  /*Para turnos */
  agregarTurnos(e: Event) {
    e.preventDefault();
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

  mostrarTurnos(turno: Turno): string {
    const dias = turno.listadia.map((d) => d.dias.descripcion).join(" - ");
    const tipo = turno.tipoturno.descripcion;
    return `${dias}   (${tipo} ${turno.horainicio.slice(0, 5)} a ${turno.horafin.slice(0, 5)})`;
  }

  mostrarDias(dias: Listadia[]): string {
    return dias.map((d) => d.dias.descripcion).join(", ");
  }

  editarHorario() {
    this.idDisciplina = Number(this.dialogData.idDisciplina);
    this.idSede = Number(this.dialogData.idSede);
    this.idEditHorario = Number(this.dialogData.idEditHorario);
    this.horarioService.findById(Number(this.idEditHorario)).subscribe({
      next: (data) => {
        this.horarioForm.get("numvacante")?.setValue(data.numVacante);
        this.horarioForm.get("numpreiscripcion")?.setValue(data.limitePreinscripcion);
        this.horarioForm.get("modalidad")?.setValue(data.modalidad.idModalidad);
        this.horarioForm.get("nivel")?.setValue(data.nivel.idNivel);
        this.horarioForm.get("temporada")?.setValue(data.temporada.idTemporada);
        this.horarioForm.get("categoria")?.setValue(data.categoriaedad.idCategoriaedad);
        this.horarioForm.get("turno")?.setValue(data.turno);
        this.contador = data.contador;
        this.usuariocrea = data.usuariocrea!;
        this.fechacreada = data.fechacreada!;
      },
      error: (error) => {
        this.toastrService.error(error.error.value[0].message, "Error al cargar datos", { timeOut: 3200 });
      },
    });
  }
  guardarHorario() {
    const listaDataHorarios: Horario[] = [];
    if (this.idEditHorario !== 0) {
      this.actualizarHorario();
    } else {
      this.listaTurnos.forEach((t) => {
        const dataHorario: Horario = {
          numVacante: Number(this.horarioForm.get("numvacante")!.value),
          contador: 0,
          limitePreinscripcion: Number(this.horarioForm.get("numpreiscripcion")!.value),
          usuariocrea: "1",
          fechacreada: String(this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")),
          usuariomodifica: null,
          fechamodificada: null,
          estado: "1",
          turno: {
            idTurno: Number(t.idTurno),
          },
          listadisciplina: {
            estado: "1",
            sede: {
              idSede: Number(this.dialogData.idSede),
            },
            disciplina: {
              idDisciplina: Number(this.dialogData.idDisciplina),
            },
          },
          temporada: {
            idTemporada: Number(this.horarioForm.get("temporada")!.value),
          },
          categoriaedad: {
            idCategoriaedad: Number(this.horarioForm.get("categoria")!.value),
          },
          modalidad: {
            idModalidad: Number(this.horarioForm.get("modalidad")!.value),
          },
          nivel: {
            idNivel: Number(this.horarioForm.get("nivel")!.value),
          },
        };
        listaDataHorarios.push(dataHorario);
      });

      this.horarioService.crearHorarios(listaDataHorarios).subscribe({
        next: () => {
          this.idEditHorario = 0;
          this.listaHorario.closeModal();
          this.listaHorario.actualizarTablaHorario();
          this.toastrService.success("Se guardaron los datos correctamente.", "Exitoso", { timeOut: 3200 });
          this.horarioForm.reset();
        },
        error: (error) => {
          this.idEditHorario = 0;
          this.listaHorario.closeModal();
          this.toastrService.error(error.error.value[0].message, "Error en guardar", { timeOut: 3200 });
          this.horarioForm.reset();
        },
      });
    }
  }
  actualizarHorario() {
    const dataHorario: Horario = {
      idHorario: Number(this.idEditHorario),
      numVacante: Number(this.horarioForm.get("numvacante")!.value),
      contador: Number(this.contador),
      limitePreinscripcion: Number(this.horarioForm.get("numpreiscripcion")!.value),
      usuariocrea: this.usuariocrea,
      fechacreada: this.fechacreada,
      usuariomodifica: "1",
      fechamodificada: String(this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")),
      estado: "1",
      turno: {
        idTurno: Number(this.horarioForm.get("turno")!.value.idTurno),
      },
      listadisciplina: {
        estado: "1",
        sede: {
          idSede: Number(this.idSede),
        },
        disciplina: {
          idDisciplina: Number(this.idDisciplina),
        },
      },
      temporada: {
        idTemporada: Number(this.horarioForm.get("temporada")!.value),
      },
      categoriaedad: {
        idCategoriaedad: Number(this.horarioForm.get("categoria")!.value),
      },
      modalidad: {
        idModalidad: Number(this.horarioForm.get("modalidad")!.value),
      },
      nivel: {
        idNivel: Number(this.horarioForm.get("nivel")!.value),
      },
    };
    this.horarioService.update(this.idEditHorario, dataHorario).subscribe({
      next: () => {
        this.idEditHorario = 0;
        this.listaHorario.closeModal();
        this.listaHorario.actualizarTablaHorario();
        this.toastrService.success("Se actualizaron los datos correctamente.", "Exitoso", { timeOut: 3200 });
        this.horarioForm.reset();
        this.resetData();
      },
      error: (error) => {
        this.idEditHorario = 0;
        this.listaHorario.closeModal();
        this.listaHorario.actualizarTablaHorario();
        this.toastrService.error(error.error.value[0].message, "Error en actualizar", { timeOut: 3200 });
        this.horarioForm.reset();
        this.resetData();
      },
    });
  }

  compareTurno(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.idTurno === c2.idTurno : c1 === c2;
  }

  resetData() {
    this.contador = 0;
    this.usuariocrea = "";
    this.fechacreada = "";
    this.idSede = 0;
    this.idEditHorario = 0;
    this.idDisciplina = 0;
  }

  soloNumeros(event: KeyboardEvent, type: ValidationType) {
    validarInput(event, type);
  }
}
