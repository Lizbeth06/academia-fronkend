import { Convocatoria } from "./../../../../model/convocatoria";
import { AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { trigger, transition, style, animate } from "@angular/animations";

// Angular Material Modules
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { ConvocatoriaService } from "../../../../services/convocatoria.service";
import { provideNativeDateAdapter } from "@angular/material/core";
import { Tipoconvocatoria } from "../../../../model/tipoconvocatoria";
import { TipoconvocatoriaService } from "../../../../services/tipoconvocatoria.service";
import { TemporadaService } from "../../../../services/temporada.service";
import { SedeService } from "../../../../services/sede.service";
import { DisciplinaService } from "../../../../services/disciplina.service";
import { CategoriaedadService } from "../../../../services/categoriaedad.service";
import { Temporada } from "../../../../model/temporada.model";
import { Sede } from "../../../../model/sede.model";
import { MaterialModule } from "../../../../material/material.module";
import { Router, RouterLink } from "@angular/router";
import { Categoriaedad } from "../../../../model/categoriaedad.model";
import { ListahorarioService } from "../../../../services/listahorario.service";
import { ListarHorConv } from "../../../../model/Listarlistadohorario.model";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { PaginatorService } from "../../../../services/security/paginator.service";
import { DialogcustomComponent } from "../../../dialogcustom/dialogcustom.component";
import { MatDialogRef } from "@angular/material/dialog";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { ToastrService } from "ngx-toastr";
import { ConvocatoriaAgrupada } from "../../../../model/convocatoriaagrupada.model";
import { Disciplina } from "../../../../model/disciplina.model";
/**
 * Interface actualizada con deportes y tipo
 */

@Component({
  selector: "app-convocatoria",
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: "./convocatoria-lista.component.html",
  styleUrls: ["./convocatoria-lista.component.css"],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorService }],
})
export class ConvocatoriaComponent implements OnInit {
  constructor(private router: Router, private dialogService: DialogService, private toastrService: ToastrService) {}

  private matDialogRef!: MatDialogRef<DialogcustomComponent>;

  listaCovocatoria: MatTableDataSource<ConvocatoriaAgrupada>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  convocatoriasFiltradas: ConvocatoriaAgrupada[] = [];
  listaconvocatoriaCard: ListarHorConv[] = [];

  tiposConvocatoria: Tipoconvocatoria[] = [];
  temporadas: Temporada[] = [];
  sedes: Sede[] = [];
  disciplinas: Disciplina[] = [];
  categorias: Categoriaedad[] = [];

  /*Inyección de servicios */
  listahorarioService = inject(ListahorarioService);
  convocatoriaService = inject(ConvocatoriaService);
  tipoConvocatoriaService = inject(TipoconvocatoriaService);
  temporadaService = inject(TemporadaService);
  sedeService = inject(SedeService);
  disciplinaService = inject(DisciplinaService);
  categoriaEdadService = inject(CategoriaedadService);

  regiones: string[] = [];
  // sedes: string[] = [];

  cargando: boolean = true;
  mostrarFiltros: boolean = false;
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  convocatoriaEditando: Convocatoria | null = null;
  mostrarPreview: boolean = false;
  convocatoriaPreview: Convocatoria | null = null;

  mostrarMensajeCentral: boolean = false;
  tipoMensaje: "success" | "error" | "loading" = "success";
  textoMensaje: string = "";

  idDeleteConvocatoria = 0;
  mostrarConfirmacion: boolean = false;
  tituloConfirmacion: string = "";
  mensajeConfirmacion: string = "";
  accionConfirmacion: (() => void) | null = null;

  columnasTabla: string[] = ["numero", "titulo", "subtitulo", "region", "sede", "estado", "acciones"];
  nuevaConvocatoria: Convocatoria = this.crearConvocatoriaVacia();
  imagenSeleccionada: File | null = null;
  imagenPreview: string = "";
  erroresFormulario: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.getAllConvocatoria();
    this.cargarTiposConvocatorias();
    this.cargarTemporadas();
    this.cargarSedes();
    this.cargarDisciplinas();
    this.cargarCategoriasEdad();
    this.actualizarEstadosPorCupos();
  }

  getAllConvocatoria() {
    this.cargando = true;
    this.convocatoriaService.getAllConvocatoria().subscribe({
      next: (data) => {
        this.crearTabla(data);
        console.log(data);
      },
    });
  }

  crearTabla(data: ConvocatoriaAgrupada[]) {
    this.listaCovocatoria = new MatTableDataSource(data);
    this.listaCovocatoria.paginator = this.paginator;
    this.listaCovocatoria.sort = this.sort;
  }
  getCardConvocatoria() {
    this.listahorarioService.findAll().subscribe({
      next: (data) => {
        this.listaconvocatoriaCard = data;
      },
    });
  }
  cargarTiposConvocatorias() {
    this.cargando = true;
    this.tipoConvocatoriaService.findAll().subscribe((data) => {
      this.tiposConvocatoria = data;
      this.cargando = false;
    });
  }

  cargarTemporadas() {
    this.cargando = true;
    this.temporadaService.findAll().subscribe((data) => {
      this.temporadas = data;
      this.cargando = false;
    });
  }
  cargarSedes() {
    this.cargando = true;
    this.sedeService.findAll().subscribe((data) => {
      this.sedes = data;
      this.cargando = false;
    });
  }
  cargarDisciplinas() {
    this.cargando = true;
    this.disciplinaService.findAll().subscribe((data) => {
      // this.disciplinas = data;
      this.cargando = false;
    });
  }
  cargarCategoriasEdad() {
    this.categoriaEdadService.findAll().subscribe((data) => {
      this.categorias = data;
      this.cargando = false;
    });
  }
  mostrarSedes(convocatoria: ConvocatoriaAgrupada): string {
    const sedes = [...new Set(convocatoria.listaHorarios.map((lh) => lh.horario.listadisciplina.sede.nombre))];
    return sedes.join(", ");
  }

  extraerOpcionesFiltros(): void {
    // this.regiones = [...new Set(this.convocatorias.map((c) => c.region).filter((r) => r))].sort() as string[];
    // this.sedes = [...new Set(this.convocatorias.map(c => c.sede).filter(s => s))].sort() as string[];
  }

  inscribirse(convocatoria: Convocatoria): void {
    // if (convocatoria.estado === "activa" && convocatoria.numdisponibles > 0) {
    //   // TODO: Navegar al formulario de pre-inscripción
    //   // this.mostrarMensajeExito(Redirigiendo a inscripción: ${convocatoria.titulo});
    // }
  }

  compartir(convocatoria: Convocatoria): void {
    if (navigator.share) {
      navigator.share({
        title: convocatoria.titulo,
        text: convocatoria.descripcion,
        url: window.location.href,
      });
    } else {
      // const url = ${window.location.origin}/convocatoria/${convocatoria.id_convocatoria};
      // navigator.clipboard.writeText(url);
      this.mostrarMensajeExito("Enlace copiado al portapapeles");
    }
  }

  /* Gestionar */
  verConvocatoriaCard(): void {
    this.router.navigate(["/admin/inscripcion/convocatoria/cards"]);
  }

  abrirFormularioNueva(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.nuevaConvocatoria = this.crearConvocatoriaVacia();
    this.imagenPreview = "";
    this.imagenSeleccionada = null;
    this.erroresFormulario = {};
  }

  editarConvocatoria(id: number): void {
    localStorage.setItem("editConvocatoria", id.toString());
    this.router.navigate(["/admin/inscripcion/convocatoria/editar"]);
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.convocatoriaEditando = null;
    this.imagenPreview = "";
    this.imagenSeleccionada = null;
    this.erroresFormulario = {};
  }

  crearConvocatoriaVacia(): Convocatoria {
    return {
      idConvocatoria: 0,
      titulo: "",
      subtitulo: "",
      descripcion: "",
      urlImagen: "",
      estado: "activa",
      temporada: { idTemporada: 1 },
      // fechacreada: new Date(),
    };
  }

  validarFormulario(): boolean {
    this.erroresFormulario = {};
    let esValido = true;

    if (!this.nuevaConvocatoria.titulo?.trim()) {
      this.erroresFormulario["titulo"] = true;
      esValido = false;
    }
    if (!this.nuevaConvocatoria.subtitulo?.trim()) {
      this.erroresFormulario["subtitulo"] = true;
      esValido = false;
    }
    if (!this.nuevaConvocatoria.descripcion?.trim()) {
      this.erroresFormulario["descripcion"] = true;
      esValido = false;
    }
    // if (!this.nuevaConvocatoria.numvacantes || this.nuevaConvocatoria.numvacantes <= 0) {
    //   this.erroresFormulario["numvacantes"] = true;
    //   esValido = false;
    // }
    // if (this.nuevaConvocatoria.numdisponibles < 0) {
    //   this.erroresFormulario["numdisponibles"] = true;
    //   esValido = false;
    // }

    return esValido;
  }

  guardarConvocatoria(): void {
    if (!this.validarFormulario()) {
      this.mostrarMensajeError("Por favor complete todos los campos obligatorios");
      return;
    }

    this.mostrarMensajeLoading("Guardando convocatoria...");

    setTimeout(() => {
      // Calcular inscritos y actualizar estado
      // this.nuevaConvocatoria.numinscritos = this.nuevaConvocatoria.numvacantes - this.nuevaConvocatoria.numdisponibles;
      // this.nuevaConvocatoria.estado = this.nuevaConvocatoria.numdisponibles === 0 ? "cerrada" : "activa";

      if (this.modoEdicion && this.convocatoriaEditando) {
        // Actualizar
        // const index = this.convocatorias.findIndex((c) => c.id_convocatoria === this.convocatoriaEditando!.id_convocatoria);
        // if (index !== -1) {
        //   this.convocatorias[index] = { ...this.nuevaConvocatoria };
        //   // TODO: API call
        //   console.log(this.nuevaConvocatoria);
        // }
        this.mostrarMensajeExito("Convocatoria actualizada correctamente");
      } else {
        // Crear
        // this.nuevaConvocatoria.id_convocatoria =
        //   this.convocatorias.length > 0 ? Math.max(...this.convocatorias.map((c) => c.id_convocatoria)) + 1 : 1;
        // this.nuevaConvocatoria.fechacreada = new Date();
        // this.convocatorias.push({ ...this.nuevaConvocatoria });
        // TODO: API call
        console.log(this.nuevaConvocatoria);

        this.mostrarMensajeExito("Convocatoria creada correctamente");
      }

      this.extraerOpcionesFiltros();

      setTimeout(() => {
        this.cerrarFormulario();
      }, 1500);
    }, 1000);
  }

  // eliminarConvocatoria(convocatoria: Convocatoria): void {
  //   this.mostrarDialogoConfirmacion(
  //     'Eliminar Convocatoria',
  //     ¿Está seguro de eliminar la convocatoria "${convocatoria.titulo}"?,
  //     () => {
  //       this.mostrarMensajeLoading('Eliminando convocatoria...');

  //       setTimeout(() => {
  //         const index = this.convocatorias.findIndex(c => c.id_convocatoria === convocatoria.id_convocatoria);
  //         if (index !== -1) {
  //           this.convocatorias.splice(index, 1);
  //           // TODO: API call

  //           this.extraerOpcionesFiltros();
  //           this.aplicarFiltros();
  //           this.mostrarMensajeExito('Convocatoria eliminada correctamente');
  //         }
  //       }, 1000);
  //     }
  //   );
  // }

  verPreview(convocatoria: Convocatoria): void {
    this.convocatoriaPreview = convocatoria;
    this.mostrarPreview = true;
  }

  cerrarPreview(): void {
    this.mostrarPreview = false;
    this.convocatoriaPreview = null;
  }

  prevenirCierrePreview(event: Event): void {
    event.stopPropagation();
  }

  onImagenSeleccionada(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        this.mostrarMensajeError("Solo se permiten archivos de imagen");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.mostrarMensajeError("La imagen no debe superar los 5MB");
        return;
      }

      this.imagenSeleccionada = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
        this.nuevaConvocatoria.urlImagen = e.target.result;
      };
      reader.readAsDataURL(file);

      // TODO: Subir a servidor
      // this.subirImagenServidor(file);
    }
  }

  // =========================
  // MENSAJES CENTRALES
  // =========================

  mostrarMensajeExito(mensaje: string): void {
    this.tipoMensaje = "success";
    this.textoMensaje = mensaje;
    this.mostrarMensajeCentral = true;
    setTimeout(() => {
      this.mostrarMensajeCentral = false;
    }, 2500);
  }

  mostrarMensajeError(mensaje: string): void {
    this.tipoMensaje = "error";
    this.textoMensaje = mensaje;
    this.mostrarMensajeCentral = true;
    setTimeout(() => {
      this.mostrarMensajeCentral = false;
    }, 3000);
  }

  mostrarMensajeLoading(mensaje: string): void {
    this.tipoMensaje = "loading";
    this.textoMensaje = mensaje;
    this.mostrarMensajeCentral = true;
  }

  // =========================
  // CONFIRMACIÓN PERSONALIZADA
  // =========================

  mostrarDialogoConfirmacion(titulo: string, mensaje: string, accion: () => void): void {
    this.tituloConfirmacion = titulo;
    this.mensajeConfirmacion = mensaje;
    this.accionConfirmacion = accion;
    this.mostrarConfirmacion = true;
  }

  confirmarAccion(): void {
    this.mostrarConfirmacion = false;
    if (this.accionConfirmacion) {
      this.accionConfirmacion();
      this.accionConfirmacion = null;
    }
  }

  cancelarConfirmacion(): void {
    this.mostrarConfirmacion = false;
    this.accionConfirmacion = null;
  }

  // =========================
  // UTILIDADES
  // =========================

  actualizarEstadosPorCupos(): void {
    // this.convocatorias.forEach((conv) => {
    //   if (conv.numdisponibles === 0) {
    //     conv.estado = "cerrada";
    //   } else {
    //     conv.estado = "activa";
    //   }
    // });
  }

  modalEliminar(template: TemplateRef<any>, idDelete: number) {
    this.idDeleteConvocatoria = idDelete;
    this.matDialogRef = this.dialogService.openDialogCustom({
      template,
    });
  }
  deleteConvocatoria() {
    this.listahorarioService.eliminarConvocatoria(this.idDeleteConvocatoria).subscribe({
      next: () => {
        this.idDeleteConvocatoria = 0;
        this.getAllConvocatoria();
        this.matDialogRef.close();
        this.toastrService.success("Se elimino corectamente", "Éxitoso", { timeOut: 3200 });
      },
      error: (err) => {
        this.idDeleteConvocatoria = 0;
        this.matDialogRef.close();
        this.toastrService.error("Error al eliminar", "Error", { timeOut: 3200 });
      },
    });
    console.log(this.idDeleteConvocatoria);
  }
}
