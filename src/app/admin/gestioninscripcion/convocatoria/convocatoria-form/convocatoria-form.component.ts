import { Component, inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { validarInput, ValidationType } from "../../../../util/validaciones.util";
import { Listadia } from "../../../../model/turno.model";
import { CommonModule, DatePipe } from "@angular/common";
import { Disciplina } from "../../../../model/disciplina.model";
import { ToastrService } from "ngx-toastr";
import { Ubigeo } from "../../../../model/ubigeo.model";
import { Sede } from "../../../../model/sede.model";
import { UbigeoService } from "../../../../services/ubigeo.service";
import { SedeService } from "../../../../services/sede.service";
import { DisciplinaService } from "../../../../services/disciplina.service";
import { MatDialogRef } from "@angular/material/dialog";
import { DialogcustomComponent } from "../../../dialogcustom/dialogcustom.component";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { HorarioService } from "../../../../services/horario.service";
import { ListaAgrupada } from "../../../../model/listaagrupadahorario.model";
import { HorariosFormComponent } from "../horarios-form/horarios-form.component";
import { SelecthorarioFormComponent } from "../selecthorario-form/selecthorario-form.component";
import { Temporada } from "../../../../model/temporada.model";
import { TemporadaService } from "../../../../services/temporada.service";
import { Horario } from "../../../../model/horario.model";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { ListaHorario, Listahorariobloque } from "../../../../model/listahorario.model";
import { ImageService } from "../../../../services/image.service";
import { ListahorarioService } from "../../../../services/listahorario.service";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
  selector: "app-convocatoria-form",
  imports: [CommonModule, MaterialModule, HorariosFormComponent, SelecthorarioFormComponent],
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
  private listahorarioService = inject(ListahorarioService);
  private sedeService = inject(SedeService);
  private temporadaService = inject(TemporadaService);
  private disciplinaService = inject(DisciplinaService);
  private horarioService = inject(HorarioService);
  private imageService = inject(ImageService);

  @ViewChild(HorariosFormComponent) formulario!: HorariosFormComponent;
  @ViewChild(SelecthorarioFormComponent) formSelect!: SelecthorarioFormComponent;

  private matDialogRef!: MatDialogRef<DialogcustomComponent>;

  convocatoriaForm: FormGroup;
  complejoForm: FormGroup;
  disciplinaForm: FormGroup;

  imagenPreview: string = "";
  listaHorario: ListaHorario[] = [];
  selectedImage: string | null = null;
  selectedFile: File;
  urlImage = "";

  horarioColumns: string[] = ["id", "modalidad", "etapa", "categoria", "edad", "frecuencia", "hora", "estado", "vacante", "inscrito", "accion"];
  displayedColumns: string[] = ["select", "horario", "modalidad", "ubicacion"];
  dataHorario = new MatTableDataSource<Horario>();
  selection = new SelectionModel<Horario>(true, []);

  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];
  disciplina: Disciplina[] = [];
  sedes: Sede[] = [];
  temporada: Temporada[] = [];

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
  habilitar = false;
  desabilitar = false;
  numeroHorarios = 0;

  private buildForm() {
    this.convocatoriaForm = this.formBuild.group({
      titulo: ["", Validators.required],
      subtitulo: ["", Validators.required],
      descripcion: [""],
      temporada: ["", Validators.required],
      finicioclase: [{ value: "", disabled: true }],
      fcierreclase: [{ value: "", disabled: true }],
      finicioinscripcion: [{ value: "", disabled: true }],
      fcierreinscripcion: [{ value: "", disabled: true }],
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
    this.validarConvocatoria();
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
    this.temporadaService.findAll().subscribe({
      next: (data) => {
        this.temporada = data;
      },
      error: (err) => console.error(err),
    });
  }
  /*Convocatoria*/

  crearConvocatoria() {}

  onImage(event: any) {
    this.loading = true;
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedImage = URL.createObjectURL(this.selectedFile);
      this.desabilitar = false;
    }
  }
  removeImage() {
    this.selectedImage = "";
    const input = document.querySelector(".image-input") as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  }

  cargarImage() {
    this.desabilitar = true;
    if (!this.selectedFile) {
      this.toastrService.error("No hay imagen seleccionada", "Error", { timeOut: 3200 });
      return;
    }
    this.imageService.createImage(this.selectedFile).subscribe({
      next: (response) => {
        console.log(response);
        this.publicarConvocatoria(response.url);
        this.toastrService.success("Subio correctamente los datos", "Éxitoso", { timeOut: 3200 });
      },
      error: (err) => {
        this.toastrService.error("Error al cargar los datos", "Error", { timeOut: 3200 });
      },
    });
  }

  resumenHorario(data: Horario): string {
    const disciplina = data.listadisciplina.disciplina.descripcion;
    const dias = data.turno.listadia?.map((l) => l.dias?.codigo).join(", ");
    const hora = `${data.turno.horainicio} a ${data.turno.horafin} `;
    return `${disciplina} los ${dias} de ${hora}`;
  }
  compararSeleccion() {
    const numSeleccion = this.selection.selected.length;
    const numFilas = this.dataHorario.data.length;
    return numSeleccion === numFilas;
  }

  seleccionarTodas() {
    if (this.compararSeleccion()) {
      this.selection.clear();
      this.numeroHorarios = this.numeroHorarios - this.dataHorario.data.length;
      return;
    }
    this.selection.select(...this.dataHorario.data);
    this.numeroHorarios += this.dataHorario.data.length;
  }

  marcarCasilla(fila?: Horario): string {
    if (!fila) {
      return `${this.compararSeleccion() ? "deselect" : "select"} all`;
    }

    return `${this.selection.isSelected(fila) ? "deselect" : "select"} row ${fila.idHorario! + 1}`;
  }
  onSelecciontemporada() {
    this.convocatoriaForm.patchValue({
      finicioclase: this.datePipe.transform(this.convocatoriaForm.get("temporada")!.value.finicioclases, "dd-MM-yyyy"),
      fcierreclase: this.datePipe.transform(this.convocatoriaForm.get("temporada")!.value.fcierreclases, "dd-MM-yyyy"),
      finicioinscripcion: this.datePipe.transform(this.convocatoriaForm.get("temporada")!.value.faperturainscripcion, "dd-MM-yyyy"),
      fcierreinscripcion: this.datePipe.transform(this.convocatoriaForm.get("temporada")!.value.fcierreinscripcion, "dd-MM-yyyy"),
    });
    console.log(this.convocatoriaForm.get("temporada")!.value);
  }
  publicarConvocatoria(urlImage: string) {
    // this.listarHorarios();
    const dataListahorario: Listahorariobloque = {
      convocatoria: {
        titulo: String(this.convocatoriaForm.get("titulo")!.value.trim()),
        subtitulo: String(this.convocatoriaForm.get("subtitulo")!.value.trim()),
        descripcion: String(this.convocatoriaForm.get("descripcion")!.value.trim()),
        urlImagen: this.selectedImage == "" ? "" : urlImage,
        estado: "1",
        fechamodificada: "",
        usuariomodifica: "",
        fechacreada: String(this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")).trim(),
        usuariocrea: "1",
        temporada: { idTemporada: Number(this.convocatoriaForm.get("temporada")!.value.idTemporada) },
      },
      listaHorarios: this.listaHorario,
    };
    console.log(dataListahorario);
    this.listahorarioService.crearConvocatoria(dataListahorario).subscribe({
      next: () => {
        this.desabilitar = false;
        this.habilitar = false;
        this.formSelect.resetFormulario();
        this.dataHorario.data = [];
        this.selection.clear();
      },
      error: (error) => {
        this.toastrService.error("Error al cargar los datos", "Error", { timeOut: 3200 });
      },
    });
  }
  onCheckboxChange(event: MatCheckboxChange, row: Horario) {
    if (event.checked) {
      this.selection.select(row);

      // Agregar a listaHorario solo si no existe
      if (!this.listaHorario.some((h) => h.horario.idHorario === row.idHorario)) {
        this.listaHorario.push({
          intervaloHora: row.turno.horainicio + " - " + row.turno.horafin,
          turno: String(row.turno.tipoturno?.descripcion),
          estado: "1",
          horario: { idHorario: row.idHorario! },
        });
        this.numeroHorarios += 1;
        console.log("entro   " + this.numeroHorarios);
      }
    } else {
      this.numeroHorarios -= 1;
      this.selection.deselect(row);
      this.listaHorario = this.listaHorario.filter((h) => h.horario.idHorario !== row.idHorario);
    }
  }
  recuperarHorarios() {
    console.log(this.dataHorario.data.length);
    this.dataHorario.data.forEach((horario) => {
      if (this.listaHorario.some((d) => d.horario.idHorario === horario.idHorario)) {
        this.selection.select(horario);
      }
    });
  }

  validarConvocatoria() {
    if (this.dataHorario.data.length !== 0) {
      this.convocatoriaForm.enable();
      this.convocatoriaForm.get("finicioclase")?.disable();
      this.convocatoriaForm.get("fcierreclase")?.disable();
      this.convocatoriaForm.get("finicioinscripcion")?.disable();
      this.convocatoriaForm.get("fcierreinscripcion")?.disable();
      this.habilitar = true;
    } else {
      this.convocatoriaForm.disable();
      this.habilitar = false;
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
    this.depId = this.complejoForm.get("departamento")?.value.ubiDpto;
    this.nomdep = this.complejoForm.get("departamento")?.value.ubiNombre;
    this.complejoForm.patchValue({ provincia: "", sede: "", distrito: "" });
    this.listaDisciplinas = [];
    this.provincias = [];
    this.distritos = [];
    this.sedes = [];
    this.ubigeoService.findProvincias(this.depId).subscribe({
      next: (data) => {
        this.provincias = data;
      },
    });
  }
  onProvinciaChange(tipoForm?: string) {
    const provId = this.complejoForm.get("provincia")?.value.ubiProvincia;

    this.nomprov = this.complejoForm.get("provincia")?.value.ubiNombre;
    this.complejoForm.patchValue({ distrito: "", sede: "" });
    this.listaDisciplinas = [];
    this.distritos = [];
    this.sedes = [];

    this.ubigeoService.findDistritos(this.depId, provId).subscribe({
      next: (data) => {
        this.distritos = data;
      },
    });
  }
  onDistritoChange(tipoForm?: string) {
    const nomdist = this.complejoForm.get("distrito")?.value.ubiNombre;
    this.complejoForm.patchValue({ sede: "" });
    this.listaDisciplinas = [];
    this.sedes = [];

    this.sedeService.getSedexubicacion(`${this.nomdep}/${this.nomprov}/${nomdist}`).subscribe((data) => {
      this.sedes = data;
    });
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
  /*Datos de horarios */
  horariosAgregados(lista: Horario[]) {
    this.dataHorario = new MatTableDataSource(lista);
    this.selection.clear();
    this.recuperarHorarios();
    this.validarConvocatoria();
    this.desabilitar = false;
  }

  /*Los compara los select*/
  compareTurno(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.idTurno === c2.idTurno : c1 === c2;
  }
}
