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
import { ListahorarioComponent } from "../listahorario/listahorario.component";
import { ConvocatoriaService } from "../../../../services/convocatoria.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-convocatoria-form",
  imports: [CommonModule, MaterialModule, HorariosFormComponent, SelecthorarioFormComponent, ListahorarioComponent],
  templateUrl: "./convocatoria-form.component.html",
  styleUrl: "./convocatoria-form.component.css",
  providers: [DatePipe],
})
export class ConvocatoriaFormComponent implements OnInit {
  constructor(
    private formBuild: FormBuilder,
    private dialogService: DialogService,
    private datePipe: DatePipe,
    private toastrService: ToastrService,
    private router: Router,
  ) {
    this.buildForm();
  }
  private ubigeoService = inject(UbigeoService);
  private listahorarioService = inject(ListahorarioService);
  private convocatoriaService = inject(ConvocatoriaService);
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
  listaverHorario: Horario[] = [];
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
  idEditConvocatoria = 0;

  listaDisciplinas: ListaAgrupada[] = [];
  expandedIndex: number | null = null;
  idDisiplinadelete = 0;
  idHorariodelete = 0;
  idDisciplina = 0;
  habilitar = false;
  desabilitar = false;
  numeroHorarios = 0;
  fcreada = "";
  ucreado = "";

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
    if (Number(localStorage.getItem("editConvocatoria")) !== 0) {
      const id = Number(localStorage.getItem("editConvocatoria"));
      this.idEditConvocatoria = id;
      this.editarConvocatoria(id);
    }
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

  editarConvocatoria(id: number) {
    this.convocatoriaService.getIdConvocatoria(id).subscribe({
      next: (data) => {
        this.fcreada = data.convocatoria.fechacreada!;
        this.ucreado = data.convocatoria.usuariocrea!;
        const horarios = data.listaHorarios.map((item) => item.horario);
        this.listaHorarioEditar(horarios);
        data.listaHorarios.filter((h) => this.insertarHorario(h.horario));

        (this.convocatoriaForm.get("titulo")?.setValue(data.convocatoria.titulo),
          this.convocatoriaForm.get("subtitulo")?.setValue(data.convocatoria.subtitulo));
        this.convocatoriaForm.get("descripcion")?.setValue(data.convocatoria.descripcion);
        this.convocatoriaForm.get("temporada")?.setValue(data.convocatoria.temporada);
        (this.convocatoriaForm.get("finicioclase")?.setValue(this.datePipe.transform(data.convocatoria.temporada.finicioclases, "dd-MM-yyyy")),
          this.convocatoriaForm.get("fcierreclase")?.setValue(this.datePipe.transform(data.convocatoria.temporada.fcierreclases, "dd-MM-yyyy")),
          this.convocatoriaForm
            .get("finicioinscripcion")
            ?.setValue(this.datePipe.transform(data.convocatoria.temporada.fcierreinscripcion, "dd-MM-yyyy")),
          this.convocatoriaForm.get("fcierreinscripcion")?.setValue(this.datePipe.transform(data.convocatoria.temporada.fcierreclases, "dd-MM-yyyy")),
          (this.selectedImage = data.convocatoria.urlImagen!));
        this.convocatoriaForm.get("estado")?.setValue(data.convocatoria.estado);
      },
    });
    localStorage.clear();
  }

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
    console.log("entro publicar");
    this.desabilitar = true;
    if (!this.selectedFile) {
      this.toastrService.error("No hay imagen seleccionada", "Error", { timeOut: 3200 });
      return;
    }
    this.imageService.createImage(this.selectedFile).subscribe({
      next: (response) => {
        console.log(response);
        this.publicarConvocatoria(response.url);
        if (this.idEditConvocatoria !== 0) {
          this.toastrService.success("Se actualizaron correctamente los datos", "Éxitoso", { timeOut: 3200 });
        } else {
          this.toastrService.success("Subio correctamente los datos", "Éxitoso", { timeOut: 3200 });
        }
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
    return `${disciplina} LOS ${dias} DE ${hora}`;
  }
  compararSeleccion() {
    const numSeleccion = this.selection.selected.length;
    const numFilas = this.dataHorario.data.length;
    return numSeleccion === numFilas;
  }

  seleccionarTodas() {
    if (this.compararSeleccion()) {
      this.selection.clear();
      this.dataHorario.data.forEach((row) => {
        this.quitarHorario(row);
      });
      return;
    }
    this.selection.select(...this.dataHorario.data);
    this.dataHorario.data.forEach((row) => {
      this.insertarHorario(row);
    });
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
  }
  actualizarConvocatoria() {
    if (!this.selectedFile) {
      console.log("entro actualizar");
      this.publicarConvocatoria(this.selectedImage!);
    } else {
      this.cargarImage();
    }
  }
  publicarConvocatoria(urlImage: string) {
    // this.listarHorarios();
    console.log(this.idEditConvocatoria);
    const dataListahorario: Listahorariobloque = {
      convocatoria: {
        titulo: String(this.convocatoriaForm.get("titulo")!.value.trim()),
        subtitulo: String(this.convocatoriaForm.get("subtitulo")!.value.trim()),
        descripcion: String(this.convocatoriaForm.get("descripcion")!.value.trim()),
        urlImagen: urlImage,
        estado: "1",
        fechamodificada: this.idEditConvocatoria !== 0 ? String(this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")).trim() : "",
        usuariomodifica: this.idEditConvocatoria !== 0 ? "1" : "",
        fechacreada: this.idEditConvocatoria !== 0 ? this.fcreada : String(this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")).trim(),
        usuariocrea: this.idEditConvocatoria !== 0 ? this.ucreado : "1",
        temporada: { idTemporada: Number(this.convocatoriaForm.get("temporada")!.value.idTemporada) },
      },
      listaHorarios: this.listaHorario,
    };
    console.log(dataListahorario);
    if (this.idEditConvocatoria !== 0) {
      this.listahorarioService.actualizarConvocatoria(this.idEditConvocatoria, dataListahorario).subscribe({
        next: () => {
          this.desabilitar = false;
          this.habilitar = false;
          this.formSelect.resetFormulario();
          this.dataHorario.data = [];
          this.selection.clear();
          this.router.navigate(["/admin/inscripcion/convocatoria"]);
          if (!this.selectedFile) {
            this.toastrService.success("Actualización correcta", "Éxitoso", { timeOut: 3200 });
          }
        },
        error: (error) => {
          this.toastrService.error("Error al actualizar", "Error", { timeOut: 3200 });
        },
      });
    } else {
      this.listahorarioService.crearConvocatoria(dataListahorario).subscribe({
        next: () => {
          this.desabilitar = false;
          this.habilitar = false;
          this.formSelect.resetFormulario();
          this.dataHorario.data = [];
          this.selection.clear();
          this.router.navigate(["/admin/inscripcion/convocatoria"]);
        },
        error: (error) => {
          this.toastrService.error("Error al cargar los datos", "Error", { timeOut: 3200 });
        },
      });
    }
  }
  onCheckboxChange(event: MatCheckboxChange, row: Horario) {
    if (event.checked) {
      this.selection.select(row);
      this.insertarHorario(row);
    } else {
      this.selection.deselect(row);
      this.quitarHorario(row);
    }
  }
  insertarHorario(row: Horario) {
    if (!this.listaHorario.some((h) => h.horario.idHorario === row.idHorario)) {
      this.listaverHorario.push(row);
      this.listaHorario.push({
        intervaloHora: row.turno.horainicio + " - " + row.turno.horafin,
        turno: String(row.turno.tipoturno?.descripcion),
        estado: "1",
        horario: { idHorario: row.idHorario! },
      });
      this.numeroHorarios++;
    }
  }

  quitarHorario(row: Horario) {
    this.listaHorario = this.listaHorario.filter((h) => h.horario.idHorario !== row.idHorario);
    this.listaverHorario = this.listaverHorario.filter((h) => h.idHorario !== row.idHorario);
    this.numeroHorarios--;
  }

  recuperarHorarios() {
    this.dataHorario.data.forEach((horario) => {
      if (this.listaHorario.some((d) => d.horario.idHorario === horario.idHorario)) {
        this.selection.select(horario);
      }
    });
  }

  validarConvocatoria() {
    if (this.dataHorario.data.length !== 0 || this.idEditConvocatoria) {
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
  modalVerListado(template: TemplateRef<any>, event: MouseEvent) {
    event.preventDefault();
    this.matDialogRef = this.dialogService.openDialogCustom({
      template,
      data: {
        listaverHorario: this.listaverHorario,
      },
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
  listaHorarioEditar(lista: Horario[]) {
    this.dataHorario = new MatTableDataSource(lista);
    this.selection.select(...this.dataHorario.data);
    this.recuperarHorarios();
    this.validarConvocatoria();
    this.habilitar = true;
  }

  compareTemporada(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.idTemporada === c2.idTemporada : c1 === c2;
  }
  volverConvocatoria() {
    this.router.navigate(["/admin/inscripcion/convocatoria"]);
  }
}
