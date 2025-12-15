import { Component, inject, OnInit, TemplateRef } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { validarInput, ValidationType } from "../../../../util/validaciones.util";
import { MatTableDataSource } from "@angular/material/table";
import { Listadia, Turno } from "../../../../model/turno.model";
import { Horario } from "../../../../model/horario.model";
import { CommonModule, DatePipe } from "@angular/common";
import { Disciplina } from "../../../../model/disciplina.model";
import { ToastrService } from "ngx-toastr";
import { Ubigeo } from "../../../../model/ubigeo";
import { Sede } from "../../../../model/sede.model";
import { Dias } from "../../../../model/dias.model";
import { Temporada } from "../../../../model/temporada.model";
import { Categoria } from "../../../../model/categoria.model";
import { UbigeoService } from "../../../../services/ubigeo.service";
import { SedeService } from "../../../../services/sede.service";
import { DisciplinaService } from "../../../../services/disciplina.service";
import { DiasService } from "../../../../services/dias.service";
import { CategoriaService } from "../../../../services/categoria.service";
import { TemporadaService } from "../../../../services/temporada.service";
import { TurnoService } from "../../../../services/turno.service";
import { MatDialogRef } from "@angular/material/dialog";
import { DialogcustomComponent } from "../../../dialogcustom/dialogcustom.component";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { HorarioService } from "../../../../services/horario.service";
import { ListaAgrupada } from "../../../../model/listaagrupadahorario.model";

@Component({
  selector: "app-convocatoria-form",
  imports: [CommonModule, MaterialModule],
  templateUrl: "./convocatoria-form.component.html",
  styleUrl: "./convocatoria-form.component.css",
  providers: [DatePipe],
})
export class ConvocatoriaFormComponent implements OnInit {
  constructor(
    private formBuild: FormBuilder,
    private dialogService: DialogService,
    private datePipe: DatePipe,
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
  private horarioService = inject(HorarioService);

  private matDialogRef!: MatDialogRef<DialogcustomComponent>;

  convocatoriaForm: FormGroup;
  complejoForm: FormGroup;
  horarioForm: FormGroup;
  disciplinaForm: FormGroup;

  imagenPreview: string = "";
  selectedImage: string | null = null;
  selectedFile: FileList;

  turnosColumns: string[] = ["id", "dias", "horas", "accion"];
  horarioColumns: string[] = ["id", "modalidad", "etapa", "categoria", "edad", "frecuencia", "hora", "estado", "vacante", "inscrito", "accion"];
  dataTurnos = new MatTableDataSource<Turno>();

  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];
  sedes: Sede[] = [];
  disciplina: Disciplina[] = [];
  dias: Dias[] = [];
  temporada: Temporada[] = [];
  categoria: Categoria[] = [];
  turno: Turno[] = [];
  depId = "";
  nomdep = "";
  nomprov = "";

  listaTurnos: Turno[] = [];
  turnoseleccionado: Turno | null = null;
  loading: boolean = false;
  idEditHorario = 0;

  private buildForm() {
    this.convocatoriaForm = this.formBuild.group({
      titulo: ["", Validators.required],
      subtitulo: ["", Validators.required],
      descripcion: ["", Validators.required],
      imagen: [""],
      estado: ["", Validators.required],
      horario: ["", Validators.required],
      modalidad: ["", Validators.required],
    });
    this.complejoForm = this.formBuild.group({
      departamento: ["", Validators.required],
      provincia: ["", Validators.required],
      distrito: ["", Validators.required],
      sede: ["", Validators.required],
    });
    this.horarioForm = this.formBuild.group({
      // dias: ["", Validators.required],
      numvacante: ["", Validators.required],

      temporada: ["", Validators.required],
      categoria: ["", Validators.required],

      turno: [""],
    });
    this.disciplinaForm = this.formBuild.group({
      nombre: [{ value: "", disabled: true }, Validators.required],
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
  /*Convocatoria*/

  crearConvocatoria() {}

  onImage(event: any) {
    const file = event.target.files[0];
    this.selectedFile = event.target.files;
    if (file) {
      this.selectedImage = URL.createObjectURL(file);
    }
  }
  removeImage() {
    this.selectedImage = "";
    const input = document.querySelector(".image-input") as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  }
  /* Para agregar disciplinas y sedes*/

  listaDisciplinas: ListaAgrupada[] = [];
  listaTemporaldisciplina: Disciplina[] = [];
  expandedIndex: number | null = null;
  idDisiplinadelete = 0;
  idHorariodelete = 0;
  idDisciplina = 0;

  addDisciplina() {
    const data = this.disciplinaForm.get("nombre")!.value;

    if (this.listaDisciplinas.length !== 0) {
      const existeDisciplina = this.listaDisciplinas.find((d) => d.idDisciplina === data.idDisciplina);
      if (existeDisciplina) {
        this.disciplinaForm.reset();
        this.toastrService.error("Ya existe esta disciplina", "Error", { timeOut: 3200, progressBar: true });
        return;
      }
      this.listaDisciplinas.push(data);
      this.listaTemporaldisciplina.push(data);
      this.disciplinaForm.reset();
    } else {
      this.listaDisciplinas.push(data);
      this.listaTemporaldisciplina.push(data);
      console.log(this.listaTemporaldisciplina);
      this.disciplinaForm.reset();
    }
  }
  deleteDisciplina() {
    this.listaDisciplinas = this.listaDisciplinas.filter((d) => d.idDisciplina !== this.idDisiplinadelete);
    this.listaTemporaldisciplina = this.listaTemporaldisciplina.filter((d) => d.idDisciplina !== this.idDisiplinadelete);
    this.matDialogRef.close();
  }
  onDepartamentoChange(): void {
    console.log(this.complejoForm.get("departamento")?.value);
    this.depId = this.complejoForm.get("departamento")?.value.ubiDpto;
    this.listaDisciplinas = [];
    this.provincias = [];
    this.distritos = [];
    this.sedes = [];
    this.complejoForm.patchValue({ provincia: "", sede: "", distrito: "" });
    this.ubigeoService.findProvincias(this.depId).subscribe({
      next: (data) => {
        this.provincias = data;
      },
    });
  }
  onProvinciaChange() {
    this.nomprov = this.complejoForm.get("provincia")?.value.ubiNombre;
    const provId = this.complejoForm.get("provincia")?.value.ubiProvincia;
    this.listaDisciplinas = [];
    this.distritos = [];
    this.sedes = [];
    this.complejoForm.patchValue({ distrito: "", sede: "" });
    this.ubigeoService.findDistritos(this.depId, provId).subscribe({
      next: (data) => {
        this.distritos = data;
      },
    });
  }
  onDistritoChange() {
    const nomdist = this.complejoForm.get("distrito")?.value.ubiNombre;
    this.listaDisciplinas = [];
    this.sedes = [];
    this.complejoForm.patchValue({ sede: "" });
    this.sedeService.getSedexubicacion(`${this.nomdep}/${this.nomprov}/${nomdist}`).subscribe((data) => (this.sedes = data));
  }

  actualizarTablaHorario() {
    this.complejoForm.invalid ? this.disciplinaForm.get("nombre")?.disable() : this.disciplinaForm.get("nombre")?.enable();

    this.loading = true;
    const idSede = this.complejoForm.get("sede")!.value;
    this.horarioService.getHorarioagrupado(idSede).subscribe((data) => {
      this.listaDisciplinas = data;
      this.loading = false;
    });
  }

  soloNumeros(event: KeyboardEvent, type: ValidationType) {
    validarInput(event, type);
  }
  editarHorario(idHorario: string, lista?: ListaAgrupada) {
    this.idDisciplina = Number(lista!.idDisciplina);
    this.idEditHorario = Number(idHorario);
    this.horarioService.findById(Number(idHorario)).subscribe({
      next: (data) => {
        this.horarioForm.get("numvacante")?.setValue(data.numVacante);
        this.horarioForm.get("temporada")?.setValue(data.temporada.idTemporada);
        this.horarioForm.get("categoria")?.setValue(data.categoriaedad.idCategoriaedad);
        this.horarioForm.get("turno")?.setValue(data.turno);
      },
      error: (error) => {
        this.toastrService.error(error.error.value[0].message, "Error al cargar datos", { timeOut: 3200 });
      },
    });
    this.nextTab();
  }

  modalEliminar(template: TemplateRef<any>, id: Number, origen: string) {
    origen === "disciplina" ? (this.idDisiplinadelete = Number(id)) : (this.idHorariodelete = Number(id));
    this.matDialogRef = this.dialogService.openDialogCustom({
      template,
    });
  }

  /* HORARIOS */
  mostrarDias(dias: Listadia[]): string {
    return dias.map((d) => d.dias.descripcion).join(", ");
  }
  mostrarDiasenhorarios(dias: Listadia[]): string {
    return dias.map((d) => d.dias.codigo).join(", ");
  }

  guardarHorario() {
    console.log(this.complejoForm.get("sede")!.value);
    const listaDataHorarios: Horario[] = [];
    if (this.idEditHorario !== 0) {
      this.actualizarHorario();
    } else {
      this.listaTurnos.forEach((t) => {
        const dataHorario: Horario = {
          numVacante: Number(this.horarioForm.get("numvacante")!.value),
          contador: 0,
          usuarioCrea: "1",
          fechaCrea: String(this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")),
          usuarioModifica: null,
          fechaModifica: null,
          estado: "1",
          turno: {
            idTurno: Number(t.idTurno),
          },
          listadisciplina: {
            estado: "1",
            sede: {
              idSede: Number(this.complejoForm.get("sede")!.value),
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
        };
        listaDataHorarios.push(dataHorario);
      });
      this.horarioService.crearHorarios(listaDataHorarios).subscribe({
        next: () => {
          this.idEditHorario = 0;
          this.prevTab(undefined, "horario");
          this.actualizarTablaHorario();
          this.toastrService.success("Se guardaron los datos correctamente.", "Exitoso", { timeOut: 3200 });
        },
        error: (error) => {
          this.idEditHorario = 0;
          this.prevTab(undefined, "horario");
          this.toastrService.error(error.error.value[0].message, "Error en guardar", { timeOut: 3200 });
        },
      });
    }
  }
  actualizarHorario() {
    const dataHorario: Horario = {
      numVacante: Number(this.horarioForm.get("numvacante")!.value),
      contador: 0,
      usuarioCrea: "",
      fechaCrea: "",
      usuarioModifica: "1",
      fechaModifica: String(this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")),
      estado: "1",
      turno: {
        idTurno: Number(this.horarioForm.get("turno")!.value.idTurno),
      },
      listadisciplina: {
        estado: "1",
        sede: {
          idSede: Number(this.complejoForm.get("sede")!.value),
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
    };
    this.horarioService.update(this.idEditHorario, dataHorario).subscribe({
      next: () => {
        this.idEditHorario = 0;
        this.prevTab(undefined, "horario");
        this.actualizarTablaHorario();
        this.toastrService.success("Se actualizaron los datos correctamente.", "Exitoso", { timeOut: 3200 });
      },
      error: (error) => {
        this.idEditHorario = 0;
        this.toastrService.error(error.error.value[0].message, "Error en actualizar", { timeOut: 3200 });
      },
    });
  }
  deleteHorario() {
    this.horarioService.delete(this.idHorariodelete).subscribe({
      next: () => {
        this.actualizarTablaHorario();
        this.matDialogRef.close();
        this.toastrService.success("Se eliminó correctamente", "Exitoso", { timeOut: 3200 });
      },
      error: (error) => {
        this.toastrService.error(error.error.value[0].message, "Error en eliminar", { timeOut: 3200 });
      },
    });
  }
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

  mostrarTurnos(turno: Turno): string {
    const dias = turno.listadia.map((d) => d.dias.descripcion).join(" - ");
    const tipo = turno.tipoturno.descripcion;
    return `${dias}   (${tipo} ${turno.horainicio.slice(0, 5)} a ${turno.horafin.slice(0, 5)})`;
  }

  /* PARA TABS*/
  tabIndex = 0;

  nextTab(origen?: string, lista?: ListaAgrupada) {
    this.clearFocus();
    if (origen === "horario") {
      this.idEditHorario = 0;
    }
    if (lista) {
      this.idDisciplina = Number(lista.idDisciplina);
    }
    this.tabIndex++;
  }

  prevTab(e?: MouseEvent, origen?: string) {
    this.clearFocus();
    e !== undefined ? e!.preventDefault() : "";
    if (origen === "horario") {
      this.idEditHorario = 0;
      this.horarioForm.reset();
      this.listaTurnos = [];
      this.dataTurnos.data = [];
    }
    if (origen === "complejo") {
      this.listaDisciplinas = [];
      this.complejoForm.reset();
    }
    this.tabIndex--;
  }

  //Para limpiar el foco
  private clearFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement.blur && activeElement.tagName !== "BODY") {
      activeElement.blur();
    }
  }

  /*Los compare para los select*/
  compareTurno(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.idTurno === c2.idTurno : c1 === c2;
  }
}
