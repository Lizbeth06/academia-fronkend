import { Component, inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { validarInput, ValidationType } from "../../../../util/validaciones.util";
import { MatTableDataSource } from "@angular/material/table";
import { Listadia, Turno } from "../../../../model/turno.model";
import { Horario } from "../../../../model/horario.model";
import { CommonModule, DatePipe } from "@angular/common";
import { Disciplina } from "../../../../model/disciplina.model";
import { ToastrService } from "ngx-toastr";
import { Ubigeo } from "../../../../model/ubigeo.model";
import { Sede } from "../../../../model/sede.model";
import { Dias } from "../../../../model/dias.model";
import { Temporada } from "../../../../model/temporada.model";
import { Categoriaedad } from "../../../../model/categoriaedad.model";
import { UbigeoService } from "../../../../services/ubigeo.service";
import { SedeService } from "../../../../services/sede.service";
import { DisciplinaService } from "../../../../services/disciplina.service";
import { DiasService } from "../../../../services/dias.service";
import { CategoriaedadService } from "../../../../services/categoriaedad.service";
import { TemporadaService } from "../../../../services/temporada.service";
import { TurnoService } from "../../../../services/turno.service";
import { MatDialogRef } from "@angular/material/dialog";
import { DialogcustomComponent } from "../../../dialogcustom/dialogcustom.component";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { HorarioService } from "../../../../services/horario.service";
import { ListaAgrupada } from "../../../../model/listaagrupadahorario.model";
import { HorariosFormComponent } from "../horarios-form/horarios-form.component";

@Component({
  selector: "app-convocatoria-form",
  imports: [CommonModule, MaterialModule, HorariosFormComponent],
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
  private horarioService = inject(HorarioService);

  @ViewChild(HorariosFormComponent) formulario!: HorariosFormComponent;

  private matDialogRef!: MatDialogRef<DialogcustomComponent>;

  convocatoriaForm: FormGroup;
  complejoForm: FormGroup;
  disciplinaForm: FormGroup;
  filtroForm: FormGroup;

  imagenPreview: string = "";
  selectedImage: string | null = null;
  selectedFile: FileList;

  horarioColumns: string[] = ["id", "modalidad", "etapa", "categoria", "edad", "frecuencia", "hora", "estado", "vacante", "inscrito", "accion"];

  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];
  sedes: Sede[] = [];
  disciplina: Disciplina[] = [];

  depId = "";
  nomdep = "";
  nomprov = "";

  loading: boolean = false;
  idEditHorario = 0;

  listaDisciplinas: ListaAgrupada[] = [];
  expandedIndex: number | null = null;
  idDisiplinadelete = 0;
  idHorariodelete = 0;
  idDisciplina = 0;

  private buildForm() {
    this.filtroForm = this.formBuild.group({
      departamento: ["", Validators.required],
      provincia: ["", Validators.required],
      distrito: ["", Validators.required],
      sede: ["", Validators.required],
      horario: ["", Validators.required],
      modalidad: ["", Validators.required],
    });
    this.convocatoriaForm = this.formBuild.group({
      titulo: ["", Validators.required],
      subtitulo: ["", Validators.required],
      descripcion: ["", Validators.required],
      imagen: [""],
      estado: ["", Validators.required],
    });
    this.complejoForm = this.formBuild.group({
      departamento: ["", Validators.required],
      provincia: ["", Validators.required],
      distrito: ["", Validators.required],
      sede: ["", Validators.required],
    });
    this.disciplinaForm = this.formBuild.group({
      nombre: [{ value: "", disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
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

  addDisciplina() {
    const data = this.disciplinaForm.get("nombre")!.value;
    const nuevaDisciplina: ListaAgrupada = {
      idDisciplina: data.idDisciplina,
      nombreDisciplina: data.descripcion,
      horarios: [],
    };
    if (this.listaDisciplinas.length !== 0) {
      const existeDisciplina = this.listaDisciplinas.find((d) => d.idDisciplina === data.idDisciplina);
      if (existeDisciplina) {
        this.disciplinaForm.reset();
        this.toastrService.error("Ya existe esta disciplina", "Error", { timeOut: 3200, progressBar: true });
        return;
      }
      const ultimoElemento = this.listaDisciplinas[this.listaDisciplinas.length - 1];

      if (ultimoElemento.horarios.length === 0) {
        this.disciplinaForm.reset();
        this.toastrService.error("Debe agregar al menos un horario", "Error", { timeOut: 3200, progressBar: true });
        return;
      }
      this.listaDisciplinas.push(nuevaDisciplina);
      this.listaDisciplinas.sort((a, b) => a.nombreDisciplina.localeCompare(b.nombreDisciplina));
      this.disciplinaForm.reset();
    } else {
      this.listaDisciplinas.push(nuevaDisciplina);
      this.listaDisciplinas.sort((a, b) => a.nombreDisciplina.localeCompare(b.nombreDisciplina));
      this.disciplinaForm.reset();
    }
  }
  deleteDisciplina() {
    this.listaDisciplinas = this.listaDisciplinas.filter((d) => d.idDisciplina !== this.idDisiplinadelete);
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
      this.listaDisciplinas.sort((a, b) => a.nombreDisciplina.localeCompare(b.nombreDisciplina));
      this.loading = false;
    });
  }

  soloNumeros(event: KeyboardEvent, type: ValidationType) {
    validarInput(event, type);
  }

  modalEliminar(template: TemplateRef<any>, id: Number, origen: string) {
    origen === "disciplina" ? (this.idDisiplinadelete = Number(id)) : (this.idHorariodelete = Number(id));
    this.matDialogRef = this.dialogService.openDialogCustom({
      template,
    });
  }

  modalIrHorario(template: TemplateRef<any>, lista: ListaAgrupada, idEditHorario: number) {
    const idSede = this.complejoForm.get("sede")!.value;
    const idDisciplina = lista.idDisciplina;
    this.idEditHorario = idEditHorario;

    this.matDialogRef = this.dialogService.openDialogCustom({
      template,
      data: { idSede, idDisciplina, idEditHorario },
    });
  }

  /* HORARIOS */

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
  mostrarDiasenhorarios(dias: Listadia[]): string {
    return dias.map((d) => d.dias.codigo).join(", ");
  }

  /* PARA TABS*/
  tabIndex = 0;

  nextTab(origen?: string) {
    this._clearFocus();
    if (origen === "horario") {
      this.idEditHorario = 0;
    }
    this.tabIndex++;
  }

  prevTab(e?: MouseEvent, origen?: string) {
    e !== undefined ? e!.preventDefault() : "";
    this._clearFocus();
    if (origen === "horario") {
      this.idEditHorario = 0;
    }
    if (origen === "complejo") {
      this.listaDisciplinas = [];
      this.complejoForm.reset();
    }
    this.tabIndex--;
  }

  // Para limpiar el foco
  private _clearFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement.blur && activeElement.tagName !== "BODY") {
      activeElement.blur();
    }
  }
  closeModal() {
    this.matDialogRef.close();
  }

  /*Los compara los select*/
  compareTurno(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.idTurno === c2.idTurno : c1 === c2;
  }
}
