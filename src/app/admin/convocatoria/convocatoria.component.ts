import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';

/**
 * Interface con campos exactos de la API
 */
export interface Convocatoria {
  id_convocatoria: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  fechainicioinscripcion: Date | null;
  fechafininscripcion: Date | null;
  fechainicioactividad: Date | null;
  fechafinactividad: Date | null;
  numdisponibles: number;
  numvacantes: number;
  numinscritos: number;
  estado: 'activa' | 'cerrada';
  fechacreada?: Date | null;
  urlimagen: string;
  region?: string;
  sede?: string;
}

/**
 * Adapter personalizado para formato DD/MM/AAAA
 */
export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: any): Date | null {
    if (!value) return null;
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  }

  override format(date: Date, displayFormat: Object): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

export const MY_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-convocatoria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  templateUrl: './convocatoria.component.html',
  styleUrls: ['./convocatoria.component.css']
})
export class ConvocatoriaComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // =========================
  // DATOS Y PAGINACIÓN
  // =========================
  convocatorias: Convocatoria[] = [];
  convocatoriasFiltradas: Convocatoria[] = [];
  convocatoriasPaginadas: Convocatoria[] = [];
  
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 30, 50, 100, 200];
  pageIndex: number = 0;
  totalConvocatorias: number = 0;

  // =========================
  // FILTROS
  // =========================
  busqueda: string = '';
  regionSeleccionada: string = '';
  sedeSeleccionada: string = '';
  estadoSeleccionado: string = '';
  fechaInicioFiltro: Date | null = null;
  fechaFinFiltro: Date | null = null;

  regiones: string[] = [];
  sedes: string[] = [];
  estadosOptions = [
    { value: 'activa', label: 'Activa' },
    { value: 'cerrada', label: 'Cerrada' }
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
  tipoMensaje: 'success' | 'error' | 'loading' = 'success';
  textoMensaje: string = '';

  // =========================
  // CONFIRMACIÓN PERSONALIZADA
  // =========================
  mostrarConfirmacion: boolean = false;
  tituloConfirmacion: string = '';
  mensajeConfirmacion: string = '';
  accionConfirmacion: (() => void) | null = null;

  // =========================
  // FORMULARIO
  // =========================
  columnasTabla: string[] = ['numero', 'titulo', 'subtitulo', 'region', 'sede', 'fechainicioinscripcion', 'fechafininscripcion', 'numdisponibles', 'estado', 'acciones'];
  nuevaConvocatoria: Convocatoria = this.crearConvocatoriaVacia();
  imagenSeleccionada: File | null = null;
  imagenPreview: string = '';
  erroresFormulario: { [key: string]: boolean } = {};

  constructor() { }

  ngOnInit(): void {
    this.cargarConvocatorias();
    this.verificarEstadosPorFecha();
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
    this.regiones = [...new Set(this.convocatorias.map(c => c.region).filter(r => r))].sort() as string[];
    this.sedes = [...new Set(this.convocatorias.map(c => c.sede).filter(s => s))].sort() as string[];
  }

  // =========================
  // FILTROS
  // =========================

  aplicarFiltros(): void {
    this.convocatoriasFiltradas = this.convocatorias.filter(conv => {
      const matchBusqueda = this.busqueda === '' ||
        conv.titulo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        conv.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        conv.subtitulo.toLowerCase().includes(this.busqueda.toLowerCase());

      const matchRegion = this.regionSeleccionada === '' || conv.region === this.regionSeleccionada;
      const matchSede = this.sedeSeleccionada === '' || conv.sede === this.sedeSeleccionada;
      const matchEstado = this.estadoSeleccionado === '' || conv.estado === this.estadoSeleccionado;

      const matchFechaInicio = !this.fechaInicioFiltro || !conv.fechainicioinscripcion ||
        new Date(conv.fechainicioinscripcion) >= this.fechaInicioFiltro;

      const matchFechaFin = !this.fechaFinFiltro || !conv.fechafininscripcion ||
        new Date(conv.fechafininscripcion) <= this.fechaFinFiltro;

      return matchBusqueda && matchRegion && matchSede && matchEstado && matchFechaInicio && matchFechaFin;
    });

    this.totalConvocatorias = this.convocatoriasFiltradas.length;
    this.pageIndex = 0;
    this.actualizarPaginacion();
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.regionSeleccionada = '';
    this.sedeSeleccionada = '';
    this.estadoSeleccionado = '';
    this.fechaInicioFiltro = null;
    this.fechaFinFiltro = null;
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
    if (convocatoria.estado === 'activa' && convocatoria.numdisponibles > 0) {
      // TODO: Navegar al formulario de pre-inscripción
      this.mostrarMensajeExito(`Redirigiendo a inscripción: ${convocatoria.titulo}`);
    }
  }

  compartir(convocatoria: Convocatoria): void {
    if (navigator.share) {
      navigator.share({
        title: convocatoria.titulo,
        text: convocatoria.descripcion,
        url: window.location.href
      });
    } else {
      const url = `${window.location.origin}/convocatoria/${convocatoria.id_convocatoria}`;
      navigator.clipboard.writeText(url);
      this.mostrarMensajeExito('Enlace copiado al portapapeles');
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
    this.imagenPreview = '';
    this.erroresFormulario = {};
  }

  editarConvocatoria(convocatoria: Convocatoria): void {
    this.modoEdicion = true;
    this.convocatoriaEditando = convocatoria;
    this.nuevaConvocatoria = { ...convocatoria };
    this.imagenPreview = convocatoria.urlimagen;
    this.mostrarFormulario = true;
    this.erroresFormulario = {};
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.convocatoriaEditando = null;
    this.imagenPreview = '';
    this.imagenSeleccionada = null;
    this.erroresFormulario = {};
  }

  crearConvocatoriaVacia(): Convocatoria {
    return {
      id_convocatoria: 0,
      titulo: '',
      subtitulo: '',
      descripcion: '',
      fechainicioinscripcion: null,
      fechafininscripcion: null,
      fechainicioactividad: null,
      fechafinactividad: null,
      numdisponibles: 0,
      numvacantes: 0,
      numinscritos: 0,
      estado: 'activa',
      fechacreada: new Date(),
      urlimagen: '',
      region: '',
      sede: ''
    };
  }

  validarFormulario(): boolean {
    this.erroresFormulario = {};
    let esValido = true;

    if (!this.nuevaConvocatoria.titulo?.trim()) {
      this.erroresFormulario['titulo'] = true;
      esValido = false;
    }
    if (!this.nuevaConvocatoria.subtitulo?.trim()) {
      this.erroresFormulario['subtitulo'] = true;
      esValido = false;
    }
    if (!this.nuevaConvocatoria.descripcion?.trim()) {
      this.erroresFormulario['descripcion'] = true;
      esValido = false;
    }
    if (!this.nuevaConvocatoria.fechainicioinscripcion) {
      this.erroresFormulario['fechainicioinscripcion'] = true;
      esValido = false;
    }
    if (!this.nuevaConvocatoria.fechafininscripcion) {
      this.erroresFormulario['fechafininscripcion'] = true;
      esValido = false;
    }
    if (!this.nuevaConvocatoria.fechainicioactividad) {
      this.erroresFormulario['fechainicioactividad'] = true;
      esValido = false;
    }
    if (!this.nuevaConvocatoria.fechafinactividad) {
      this.erroresFormulario['fechafinactividad'] = true;
      esValido = false;
    }
    if (!this.nuevaConvocatoria.numvacantes || this.nuevaConvocatoria.numvacantes <= 0) {
      this.erroresFormulario['numvacantes'] = true;
      esValido = false;
    }
    if (this.nuevaConvocatoria.numdisponibles < 0) {
      this.erroresFormulario['numdisponibles'] = true;
      esValido = false;
    }
    if (this.nuevaConvocatoria.numinscritos < 0) {
      this.erroresFormulario['numinscritos'] = true;
      esValido = false;
    }
    if (!this.nuevaConvocatoria.estado) {
      this.erroresFormulario['estado'] = true;
      esValido = false;
    }

    return esValido;
  }

  guardarConvocatoria(): void {
    if (!this.validarFormulario()) {
      this.mostrarMensajeError('Por favor complete todos los campos obligatorios');
      return;
    }

    this.mostrarMensajeLoading('Guardando convocatoria...');

    setTimeout(() => {
      if (this.modoEdicion && this.convocatoriaEditando) {
        // Actualizar
        const index = this.convocatorias.findIndex(c => c.id_convocatoria === this.convocatoriaEditando!.id_convocatoria);
        if (index !== -1) {
          this.convocatorias[index] = { ...this.nuevaConvocatoria };
          // TODO: API call
        }
        this.mostrarMensajeExito('Convocatoria actualizada correctamente');
      } else {
        // Crear
        this.nuevaConvocatoria.id_convocatoria = this.convocatorias.length > 0 
          ? Math.max(...this.convocatorias.map(c => c.id_convocatoria)) + 1 
          : 1;
        this.nuevaConvocatoria.fechacreada = new Date();
        this.convocatorias.push({ ...this.nuevaConvocatoria });
        // TODO: API call
        
        this.mostrarMensajeExito('Convocatoria creada correctamente');
      }

      this.extraerOpcionesFiltros();
      this.aplicarFiltros();

      setTimeout(() => {
        this.cerrarFormulario();
      }, 1500);
    }, 1000);
  }

  eliminarConvocatoria(convocatoria: Convocatoria): void {
    // Usar confirmación personalizada en lugar de confirm() nativo
    this.mostrarDialogoConfirmacion(
      'Eliminar Convocatoria',
      `¿Está seguro de eliminar la convocatoria "${convocatoria.titulo}"?`,
      () => {
        this.mostrarMensajeLoading('Eliminando convocatoria...');

        setTimeout(() => {
          const index = this.convocatorias.findIndex(c => c.id_convocatoria === convocatoria.id_convocatoria);
          if (index !== -1) {
            this.convocatorias.splice(index, 1);
            // TODO: API call
            
            this.extraerOpcionesFiltros();
            this.aplicarFiltros();
            this.mostrarMensajeExito('Convocatoria eliminada correctamente');
          }
        }, 1000);
      }
    );
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
      if (!file.type.startsWith('image/')) {
        this.mostrarMensajeError('Solo se permiten archivos de imagen');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.mostrarMensajeError('La imagen no debe superar los 5MB');
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
    }
  }

  // =========================
  // MENSAJES CENTRALES
  // =========================

  mostrarMensajeExito(mensaje: string): void {
    this.tipoMensaje = 'success';
    this.textoMensaje = mensaje;
    this.mostrarMensajeCentral = true;
    setTimeout(() => {
      this.mostrarMensajeCentral = false;
    }, 2500);
  }

  mostrarMensajeError(mensaje: string): void {
    this.tipoMensaje = 'error';
    this.textoMensaje = mensaje;
    this.mostrarMensajeCentral = true;
    setTimeout(() => {
      this.mostrarMensajeCentral = false;
    }, 3000);
  }

  mostrarMensajeLoading(mensaje: string): void {
    this.tipoMensaje = 'loading';
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

  verificarEstadosPorFecha(): void {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    this.convocatorias.forEach(conv => {
      if (conv.fechafininscripcion) {
        const fechaFin = new Date(conv.fechafininscripcion);
        fechaFin.setHours(0, 0, 0, 0);
        if (fechaFin < hoy && conv.estado === 'activa') {
          conv.estado = 'cerrada';
        }
      }
    });
  }

  getEstadoClass(estado: string): string {
    return estado === 'activa' ? 'estado-activa' : 'estado-cerrada';
  }

  getEstadoTexto(estado: string): string {
    return estado === 'activa' ? 'Activa' : 'Cerrada';
  }

  getPorcentajeCupos(convocatoria: Convocatoria): number {
    return Math.round((convocatoria.numinscritos / convocatoria.numvacantes) * 100);
  }

  formatearFecha(fecha: Date | null): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // =========================
  // DATOS DE EJEMPLO
  // =========================

  obtenerDatosEjemplo(): Convocatoria[] {
    return [
      {
        id_convocatoria: 1,
        titulo: 'Fútbol y Atletismo IPD',
        subtitulo: 'Academia IPD - Temporada 2025',
        descripcion: 'Inscripciones abiertas para fútbol y atletismo. ¡Totalmente gratuito!',
        fechainicioinscripcion: new Date('2025-03-01'),
        fechafininscripcion: new Date('2025-03-26'),
        fechainicioactividad: new Date('2025-04-01'),
        fechafinactividad: new Date('2025-06-30'),
        numdisponibles: 39,
        numvacantes: 50,
        numinscritos: 11,
        estado: 'activa',
        fechacreada: new Date('2025-02-01'),
        urlimagen: 'https://i.imgur.com/JELgLb5.png',
        region: 'Lima',
        sede: 'Estadio Nacional'
      },
      {
        id_convocatoria: 2,
        titulo: 'Vóley IPD Chacapampa',
        subtitulo: 'ACADEMIA IPD',
        descripcion: 'Inscripciones abiertas para vóley.',
        fechainicioinscripcion: new Date('2025-03-01'),
        fechafininscripcion: new Date('2025-03-26'),
        fechainicioactividad: new Date('2025-04-05'),
        fechafinactividad: new Date('2025-07-15'),
        numdisponibles: 42,
        numvacantes: 60,
        numinscritos: 18,
        estado: 'activa',
        fechacreada: new Date('2025-02-05'),
        urlimagen: 'https://i.imgur.com/Vep18ZR.png',
        region: 'Lima',
        sede: 'Complejo Chacapampa'
      },
      {
        id_convocatoria: 3,
        titulo: 'Cusco Multideporte 2024',
        subtitulo: 'ACADEMIA IPD',
        descripcion: 'Programa multideportivo.',
        fechainicioinscripcion: new Date('2024-09-01'),
        fechafininscripcion: new Date('2024-09-30'),
        fechainicioactividad: new Date('2024-10-01'),
        fechafinactividad: new Date('2024-12-15'),
        numdisponibles: 0,
        numvacantes: 150,
        numinscritos: 150,
        estado: 'cerrada',
        fechacreada: new Date('2024-08-15'),
        urlimagen: 'https://i.imgur.com/bYRBpjX.png',
        region: 'Cusco',
        sede: 'Complejo Deportivo Cusco'
      }
    ];
  }
}