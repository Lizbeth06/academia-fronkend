import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { trigger, transition, style, animate } from "@angular/animations";

// Angular Material Modules
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { MaterialModule } from "../../../../material/material.module";
import { RouterLink } from "@angular/router";

/**
 * Interface actualizada con deportes y tipo
 */
export interface Convocatoria {
  id_convocatoria: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  urlimagen: string;
  deporte: string;
  tipo: "deporte" | "paradeporte";
  frecuencia?: string;
  numvacantes: number;
  numdisponibles: number;
  numinscritos: number;
  estado: "activa" | "cerrada";
  region?: string;
  sede?: string;
  fechacreada?: Date | null;
}

@Component({
  selector: "app-convocatoria",
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: "./convocatoria-lista.component.html",
  styleUrls: ["./convocatoria-lista.component.css"],
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate("400ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
    ]),
  ],
})
export class ConvocatoriaListaComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // =========================
  // DATOS Y PAGINACIÓN (6 por página = 2 filas × 3 cards)
  // =========================
  convocatorias: Convocatoria[] = [];
  convocatoriasFiltradas: Convocatoria[] = [];
  convocatoriasPaginadas: Convocatoria[] = [];

  pageSize: number = 6; // 2 filas × 3 cards
  pageSizeOptions: number[] = [10, 20, 30, 50, 100, 200];
  pageIndex: number = 0;
  totalConvocatorias: number = 0;

  // =========================
  // FILTROS ACTUALIZADOS
  // =========================
  busqueda: string = "";
  regionSeleccionada: string = "";
  sedeSeleccionada: string = "";
  deporteSeleccionado: string = "";
  tipoSeleccionado: string = "";

  regiones: string[] = [];
  sedes: string[] = [];
  deportes: string[] = ["Rugby", "Tenis de campo", "Judo", "Voleibol", "Futbol", "Baloncesto", "Atletismo", "Pickleball"];
  tiposConvocatoria = [
    { value: "deporte", label: "Deporte" },
    { value: "paradeporte", label: "Para Deporte" },
  ];

  // =========================
  // ESTADOS
  // =========================
  cargando: boolean = true;
  mostrarFiltros: boolean = false;
  modoGestion: boolean = false;
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  convocatoriaEditando: Convocatoria | null = null;
  mostrarPreview: boolean = false;
  convocatoriaPreview: Convocatoria | null = null;

  // =========================
  // MENSAJES Y LOADING
  // =========================
  mostrarMensajeCentral: boolean = false;
  tipoMensaje: "success" | "error" | "loading" = "success";
  textoMensaje: string = "";

  // =========================
  // CONFIRMACIÓN PERSONALIZADA
  // =========================
  mostrarConfirmacion: boolean = false;
  tituloConfirmacion: string = "";
  mensajeConfirmacion: string = "";
  accionConfirmacion: (() => void) | null = null;

  // =========================
  // FORMULARIO
  // =========================
  columnasTabla: string[] = ["numero", "titulo", "subtitulo", "region", "sede", "deporte", "numdisponibles", "estado", "acciones"];
  nuevaConvocatoria: Convocatoria = this.crearConvocatoriaVacia();
  imagenSeleccionada: File | null = null;
  imagenPreview: string = "";
  erroresFormulario: { [key: string]: boolean } = {};

  constructor() {}

  ngOnInit(): void {
    this.cargarConvocatorias();
    this.actualizarEstadosPorCupos();
  }

  // =========================
  // CARGA DE DATOS
  // =========================

  cargarConvocatorias(): void {
    this.cargando = true;

    // TODO: Reemplazar con llamada real a API
    setTimeout(() => {
      this.convocatorias = this.obtenerDatosEjemplo();
      this.extraerOpcionesFiltros();
      this.aplicarFiltros();
      this.cargando = false;
    }, 500);
  }

  extraerOpcionesFiltros(): void {
    this.regiones = [...new Set(this.convocatorias.map((c) => c.region).filter((r) => r))].sort() as string[];
    this.sedes = [...new Set(this.convocatorias.map((c) => c.sede).filter((s) => s))].sort() as string[];
  }

  // =========================
  // FILTROS
  // =========================

  aplicarFiltros(): void {
    this.convocatoriasFiltradas = this.convocatorias.filter((conv) => {
      const matchBusqueda =
        this.busqueda === "" ||
        conv.titulo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        conv.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        conv.subtitulo.toLowerCase().includes(this.busqueda.toLowerCase());

      const matchRegion = this.regionSeleccionada === "" || conv.region === this.regionSeleccionada;
      const matchSede = this.sedeSeleccionada === "" || conv.sede === this.sedeSeleccionada;
      const matchDeporte = this.deporteSeleccionado === "" || conv.deporte === this.deporteSeleccionado;
      const matchTipo = this.tipoSeleccionado === "" || conv.tipo === this.tipoSeleccionado;

      return matchBusqueda && matchRegion && matchSede && matchDeporte && matchTipo;
    });

    this.totalConvocatorias = this.convocatoriasFiltradas.length;
    this.pageIndex = 0;
    this.actualizarPaginacion();
  }

  limpiarFiltros(): void {
    this.busqueda = "";
    this.regionSeleccionada = "";
    this.sedeSeleccionada = "";
    this.deporteSeleccionado = "";
    this.tipoSeleccionado = "";
    this.aplicarFiltros();
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  // =========================
  // PAGINACIÓN
  // =========================

  actualizarPaginacion(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.convocatoriasPaginadas = this.convocatoriasFiltradas.slice(startIndex, endIndex);
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.actualizarPaginacion();
  }

  // =========================
  // ACCIONES USUARIO
  // =========================

  inscribirse(convocatoria: Convocatoria): void {
    if (convocatoria.estado === "activa" && convocatoria.numdisponibles > 0) {
      // TODO: Navegar al formulario de pre-inscripción
      this.mostrarMensajeExito(`Redirigiendo a inscripción: ${convocatoria.titulo}`);
    }
  }

  compartir(convocatoria: Convocatoria): void {
    if (navigator.share) {
      navigator.share({
        title: convocatoria.titulo,
        text: convocatoria.descripcion,
        url: window.location.href,
      });
    } else {
      const url = `${window.location.origin}/convocatoria/${convocatoria.id_convocatoria}`;
      navigator.clipboard.writeText(url);
      this.mostrarMensajeExito("Enlace copiado al portapapeles");
    }
  }

  // =========================
  // GESTIÓN
  // =========================

  toggleModoGestion(): void {
    this.modoGestion = !this.modoGestion;
    if (!this.modoGestion) {
      this.cerrarFormulario();
    }
  }

  abrirFormularioNueva(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.nuevaConvocatoria = this.crearConvocatoriaVacia();
    this.imagenPreview = "";
    this.imagenSeleccionada = null;
    this.erroresFormulario = {};
  }

  editarConvocatoria(convocatoria: Convocatoria): void {
    this.modoEdicion = true;
    this.convocatoriaEditando = convocatoria;
    this.nuevaConvocatoria = { ...convocatoria };
    this.imagenPreview = convocatoria.urlimagen;
    this.mostrarFormulario = true;
    this.imagenSeleccionada = null;
    this.erroresFormulario = {};
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
      id_convocatoria: 0,
      titulo: "",
      subtitulo: "",
      descripcion: "",
      urlimagen: "",
      deporte: "",
      tipo: "deporte",
      numvacantes: 0,
      numdisponibles: 0,
      numinscritos: 0,
      estado: "activa",
      fechacreada: new Date(),
      region: "",
      sede: "",
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
    if (!this.nuevaConvocatoria.numvacantes || this.nuevaConvocatoria.numvacantes <= 0) {
      this.erroresFormulario["numvacantes"] = true;
      esValido = false;
    }
    if (this.nuevaConvocatoria.numdisponibles < 0) {
      this.erroresFormulario["numdisponibles"] = true;
      esValido = false;
    }

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
      this.nuevaConvocatoria.numinscritos = this.nuevaConvocatoria.numvacantes - this.nuevaConvocatoria.numdisponibles;
      this.nuevaConvocatoria.estado = this.nuevaConvocatoria.numdisponibles === 0 ? "cerrada" : "activa";

      if (this.modoEdicion && this.convocatoriaEditando) {
        // Actualizar
        const index = this.convocatorias.findIndex((c) => c.id_convocatoria === this.convocatoriaEditando!.id_convocatoria);
        if (index !== -1) {
          this.convocatorias[index] = { ...this.nuevaConvocatoria };
          // TODO: API call
        }
        this.mostrarMensajeExito("Convocatoria actualizada correctamente");
      } else {
        // Crear
        this.nuevaConvocatoria.id_convocatoria =
          this.convocatorias.length > 0 ? Math.max(...this.convocatorias.map((c) => c.id_convocatoria)) + 1 : 1;
        this.nuevaConvocatoria.fechacreada = new Date();
        this.convocatorias.push({ ...this.nuevaConvocatoria });
        // TODO: API call

        this.mostrarMensajeExito("Convocatoria creada correctamente");
      }

      this.extraerOpcionesFiltros();
      this.aplicarFiltros();

      setTimeout(() => {
        this.cerrarFormulario();
      }, 1500);
    }, 1000);
  }

  eliminarConvocatoria(convocatoria: Convocatoria): void {
    this.mostrarDialogoConfirmacion("Eliminar Convocatoria", `¿Está seguro de eliminar la convocatoria "${convocatoria.titulo}"?`, () => {
      this.mostrarMensajeLoading("Eliminando convocatoria...");

      setTimeout(() => {
        const index = this.convocatorias.findIndex((c) => c.id_convocatoria === convocatoria.id_convocatoria);
        if (index !== -1) {
          this.convocatorias.splice(index, 1);
          // TODO: API call

          this.extraerOpcionesFiltros();
          this.aplicarFiltros();
          this.mostrarMensajeExito("Convocatoria eliminada correctamente");
        }
      }, 1000);
    });
  }

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
        this.nuevaConvocatoria.urlimagen = e.target.result;
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
    this.convocatorias.forEach((conv) => {
      if (conv.numdisponibles === 0) {
        conv.estado = "cerrada";
      } else {
        conv.estado = "activa";
      }
    });
  }

  getEstadoClass(estado: string): string {
    return estado === "activa" ? "estado-activa" : "estado-cerrada";
  }

  getEstadoTexto(estado: string): string {
    return estado === "activa" ? "Activa" : "Cerrada";
  }

  getPorcentajeCupos(convocatoria: Convocatoria): number {
    return Math.round((convocatoria.numinscritos / convocatoria.numvacantes) * 100);
  }

  getTipoTexto(tipo: string): string {
    return tipo === "paradeporte" ? "Para Deporte" : "Deporte";
  }

  getTipoClass(tipo: string): string {
    return tipo === "paradeporte" ? "tipo-paradeporte" : "tipo-deporte";
  }

  // =========================
  // DATOS DE EJEMPLO - ESTADIO NACIONAL
  // =========================

  obtenerDatosEjemplo(): Convocatoria[] {
    const convocatorias: Convocatoria[] = [];
    let id = 1;

    // ESTADIO NACIONAL - 8 DEPORTES NORMALES - Frecuencia 1 (Lun-Mie-Vie)
    const deportesNormales = ["Rugby", "Tenis de campo", "Judo", "Voleibol", "Futbol", "Baloncesto", "Atletismo", "Pickleball"];

    deportesNormales.forEach((deporte) => {
      convocatorias.push({
        id_convocatoria: id++,
        titulo: `${deporte} - Estadio Nacional`,
        subtitulo: "Academia IPD - Temporada 2025",
        descripcion: `Inscripciones abiertas para ${deporte}. ¡Totalmente gratuito! Horario: Lunes, Miércoles y Viernes de 3:00 PM a 6:00 PM.`,
        urlimagen: "https://i.imgur.com/JELgLb5.png",
        deporte: deporte,
        tipo: "deporte",
        frecuencia: "Lun-Mié-Vie: 3-6 PM",
        numvacantes: 30,
        numdisponibles: 20,
        numinscritos: 10,
        estado: "activa",
        region: "Lima",
        sede: "Estadio Nacional",
        fechacreada: new Date(),
      });
    });

    // ESTADIO NACIONAL - 8 DEPORTES NORMALES - Frecuencia 2 (Mar-Jue)
    deportesNormales.forEach((deporte) => {
      convocatorias.push({
        id_convocatoria: id++,
        titulo: `${deporte} - Estadio Nacional (Turno 2)`,
        subtitulo: "Academia IPD - Temporada 2025",
        descripcion: `Inscripciones abiertas para ${deporte}. ¡Totalmente gratuito! Horario: Martes y Jueves de 3:00 PM a 6:00 PM.`,
        urlimagen: "https://i.imgur.com/Vep18ZR.png",
        deporte: deporte,
        tipo: "deporte",
        frecuencia: "Mar-Jue: 3-6 PM",
        numvacantes: 30,
        numdisponibles: 15,
        numinscritos: 15,
        estado: "activa",
        region: "Lima",
        sede: "Estadio Nacional",
        fechacreada: new Date(),
      });
    });

    // ESTADIO NACIONAL - PARA DEPORTES
    const paraDeportes = [
      { deporte: "Atletismo", nombre: "Para Atletismo (Atletismo Adaptado)" },
      { deporte: "Tenis de campo", nombre: "Tenis de Campo para Discapacidad Intelectual" },
      { deporte: "Futbol", nombre: "Futbol de Ciego" },
      { deporte: "Judo", nombre: "Para Judo" },
    ];

    paraDeportes.forEach((pd) => {
      convocatorias.push({
        id_convocatoria: id++,
        titulo: pd.nombre,
        subtitulo: "Academia IPD Para Deporte - Temporada 2025",
        descripcion: `Programa inclusivo de ${pd.nombre} para personas con discapacidad. Horario: Lunes, Miércoles y Viernes de 3:00 PM a 6:00 PM.`,
        urlimagen: "https://i.imgur.com/NyPGE4B.png",
        deporte: pd.deporte,
        tipo: "paradeporte",
        frecuencia: "Lun-Mié-Vie: 3-6 PM",
        numvacantes: 25,
        numdisponibles: 18,
        numinscritos: 7,
        estado: "activa",
        region: "Lima",
        sede: "Estadio Nacional",
        fechacreada: new Date(),
      });
    });

    // OTRAS SEDES - Ejemplos adicionales
    convocatorias.push(
      {
        id_convocatoria: id++,
        titulo: "Vóley IPD Chacapampa",
        subtitulo: "ACADEMIA IPD",
        descripcion: "Inscripciones abiertas para vóley.",
        urlimagen: "https://i.imgur.com/Vep18ZR.png",
        deporte: "Voleibol",
        tipo: "deporte",
        numvacantes: 60,
        numdisponibles: 42,
        numinscritos: 18,
        estado: "activa",
        region: "Lima",
        sede: "Complejo Chacapampa",
        fechacreada: new Date(),
      },
      {
        id_convocatoria: id++,
        titulo: "Cusco Multideporte 2024",
        subtitulo: "ACADEMIA IPD",
        descripcion: "Programa multideportivo.",
        urlimagen: "https://i.imgur.com/bYRBpjX.png",
        deporte: "Futbol",
        tipo: "deporte",
        numvacantes: 150,
        numdisponibles: 0,
        numinscritos: 150,
        estado: "cerrada",
        region: "Cusco",
        sede: "Complejo Deportivo Cusco",
        fechacreada: new Date(),
      }
    );

    return convocatorias;
  }
}
