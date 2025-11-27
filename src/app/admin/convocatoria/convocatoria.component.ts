import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/**
 * Interface para Horario
 */
export interface Horario {
  id: number;
  turno: string;
  sede: string;
  disciplina: string;
  temporada: string;
  vacantes: number;
  disponibles: number;
  textoCompleto?: string;
}

/**
 * Interface para Convocatoria
 */
export interface Convocatoria {
  id_convocatoria: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  urlimagen: string;
  deporte: string;
  tipo: 'deporte' | 'paradeporte';
  horarios: Horario[];
  numvacantes: number;
  numdisponibles: number;
  numinscritos: number;
  estado: 'activa' | 'cerrada';
  region?: string;
  sede?: string;
  fechacreada?: Date | null;
  horarioActual?: number;
}

/**
 * Interface para información del deporte
 */
export interface DeporteInfo {
  nombre: string;
  imagen: string;
  descripcion: string;
}

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
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    NgIf,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatProgressBarModule
  ],
  templateUrl: './convocatoria.component.html',
  styleUrls: ['./convocatoria.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('modalFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class ConvocatoriaComponent implements OnInit {

  // =========================
  // DATOS
  // =========================
  convocatorias: Convocatoria[] = [];
  
  // USUARIO - Datos separados
  convocatoriasFiltradasUsuario: Convocatoria[] = [];
  convocatoriasPaginadasUsuario: Convocatoria[] = [];
  pageSizeUsuario: number = 6;
  pageIndexUsuario: number = 0;
  totalConvocatoriasUsuario: number = 0;

  // GESTIÓN - Datos separados
  convocatoriasFiltradasGestion: Convocatoria[] = [];
  convocatoriasPaginadasGestion: Convocatoria[] = [];
  pageSizeGestion: number = 10;
  pageIndexGestion: number = 0;
  totalConvocatoriasGestion: number = 0;

  pageSizeOptions: number[] = [6, 12, 18, 24];

  // =========================
  // FILTROS USUARIO
  // =========================
  busquedaUsuario: string = '';
  regionSeleccionadaUsuario: string = '';
  sedeSeleccionadaUsuario: string = '';
  deporteSeleccionadoUsuario: string = '';
  filtroTipoUsuario: string = '';

  // =========================
  // FILTROS GESTIÓN
  // =========================
  busquedaGestion: string = '';
  regionSeleccionadaGestion: string = '';
  sedeSeleccionadaGestion: string = '';
  deporteSeleccionadoGestion: string = '';
  filtroTipoGestion: string = '';

  // =========================
  // OPCIONES DE FILTROS
  // =========================
  regiones: string[] = [];
  sedes: string[] = [];
  deportes: string[] = [
    'Rugby',
    'Tenis de campo',
    'Judo',
    'Voleibol',
    'Futbol',
    'Baloncesto',
    'Atletismo',
    'Pickleball'
  ];

  tiposConvocatoria: { value: string, label: string }[] = [
    { value: '', label: 'Todos los tipos' },
    { value: 'deporte', label: 'Deporte' },
    { value: 'paradeporte', label: 'Para Deporte' }
  ];

  // =========================
  // ESTADOS
  // =========================
  cargando: boolean = true;
  modoGestion: boolean = false;
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  convocatoriaEditando: Convocatoria | null = null;
  mostrarPreview: boolean = false;
  convocatoriaPreview: Convocatoria | null = null;

  // =========================
  // MODAL DEPORTE INFORMATIVO
  // =========================
  mostrarModalDeporte: boolean = false;
  deporteInfoActual: DeporteInfo | null = null;
  deportesMostrados: Set<string> = new Set();

  deportesInfo: { [key: string]: DeporteInfo } = {
    'Rugby': {
      nombre: 'Rugby',
      imagen: 'https://i.imgur.com/srcVUcm.png',
      descripcion: 'El rugby es un deporte de contacto en equipo que combina fuerza, velocidad, resistencia y trabajo en equipo. En la Academia IPD, desarrollamos habilidades técnicas y tácticas fundamentales, promoviendo valores como el respeto, la disciplina y el compañerismo.'
    },
    'Tenis de campo': {
      nombre: 'Tenis de Campo',
      imagen: 'https://i.imgur.com/srcVUcm.png',
      descripcion: 'El tenis de campo es un deporte de raqueta que mejora la coordinación, agilidad y concentración. Nuestro programa ofrece formación integral para principiantes y deportistas en desarrollo, enfocándose en técnicas de golpeo, estrategia de juego y preparación física.'
    },
    'Judo': {
      nombre: 'Judo',
      imagen: 'https://i.imgur.com/srcVUcm.png',
      descripcion: 'El judo es un arte marcial japonés que desarrolla la fuerza, flexibilidad y disciplina mental. En nuestras clases, los participantes aprenden técnicas de proyección, control y caída segura, siempre bajo los principios de máxima eficiencia y beneficio mutuo.'
    },
    'Voleibol': {
      nombre: 'Voleibol',
      imagen: 'https://i.imgur.com/srcVUcm.png',
      descripcion: 'El voleibol es un deporte de equipo dinámico que desarrolla reflejos, coordinación y comunicación. El programa de la Academia IPD incluye formación técnica en saque, recepción, colocación y remate, además de tácticas de juego en equipo.'
    },
    'Futbol': {
      nombre: 'Fútbol',
      imagen: 'https://i.imgur.com/srcVUcm.png',
      descripcion: 'El fútbol es el deporte más popular del mundo, ideal para desarrollar trabajo en equipo, resistencia y habilidades motoras. Nuestro programa abarca desde fundamentos técnicos hasta tácticas avanzadas para formar deportistas integrales.'
    },
    'Baloncesto': {
      nombre: 'Baloncesto',
      imagen: 'https://i.imgur.com/srcVUcm.png',
      descripcion: 'El baloncesto combina velocidad, agilidad y estrategia en un juego de equipo emocionante. En la Academia IPD trabajamos habilidades de dribling, pase, tiro y defensa, además de desarrollar visión de juego y trabajo colaborativo.'
    },
    'Atletismo': {
      nombre: 'Atletismo',
      imagen: 'https://i.imgur.com/srcVUcm.png',
      descripcion: 'El atletismo es la base de todos los deportes, desarrollando capacidades físicas fundamentales como velocidad, resistencia, fuerza y coordinación. Ofrecemos formación en carreras, saltos y lanzamientos para todas las edades.'
    },
    'Pickleball': {
      nombre: 'Pickleball',
      imagen: 'https://i.imgur.com/srcVUcm.png',
      descripcion: 'El pickleball es un deporte de raqueta en crecimiento que combina elementos del tenis, bádminton y ping pong. Es accesible para todas las edades y niveles, promoviendo la actividad física de manera divertida y social.'
    }
  };

  // =========================
  // MENSAJES
  // =========================
  mostrarMensajeCentral: boolean = false;
  tipoMensaje: 'success' | 'error' | 'loading' = 'success';
  textoMensaje: string = '';

  // =========================
  // CONFIRMACIÓN
  // =========================
  mostrarConfirmacion: boolean = false;
  tituloConfirmacion: string = '';
  mensajeConfirmacion: string = '';
  accionConfirmacion: (() => void) | null = null;

  // =========================
  // FORMULARIO - CAMPOS REDUCIDOS
  // =========================
  columnasTabla: string[] = ['numero', 'titulo', 'subtitulo', 'descripcion', 'horario', 'numdisponibles', 'estado', 'acciones'];
  nuevaConvocatoria: Convocatoria = this.crearConvocatoriaVacia();
  imagenSeleccionada: File | null = null;
  imagenPreview: string = '';
  erroresFormulario: { [key: string]: boolean } = {};

  // HORARIOS - Autocomplete
  todosLosHorarios: Horario[] = [];
  horariosFiltradosAutocomplete: Horario[] = [];
  horarioSeleccionadoTexto: string = '';
  horarioTemporal: Horario | null = null;
  horariosAgregados: Horario[] = [];

  constructor() { }

  ngOnInit(): void {
    this.cargarConvocatorias();
    this.actualizarEstadosPorCupos();
    this.cargarHorariosDisponibles();
  }

  // =========================
  // CARGA DE DATOS
  // =========================
  
  cargarConvocatorias(): void {
    this.cargando = true;
    setTimeout(() => {
      this.convocatorias = this.obtenerDatosEjemplo();
      this.extraerOpcionesFiltros();
      this.aplicarFiltrosUsuario();
      this.aplicarFiltrosGestion();
      this.cargando = false;
    }, 500);
  }

  extraerOpcionesFiltros(): void {
    this.regiones = [...new Set(this.convocatorias.map(c => c.region).filter(r => r))].sort() as string[];
    this.sedes = [...new Set(this.convocatorias.map(c => c.sede).filter(s => s))].sort() as string[];
  }

  cargarHorariosDisponibles(): void {
    this.todosLosHorarios = [
      { id: 1, turno: 'Lun–Mié–Vie: 3–6 PM', sede: 'Estadio Nacional', disciplina: 'Rugby', temporada: 'Temporada 2026', vacantes: 30, disponibles: 20, textoCompleto: 'Lun–Mié–Vie: 3–6 PM – Estadio Nacional – Rugby – Temporada 2026' },
      { id: 2, turno: 'Mar–Jue: 3–6 PM', sede: 'Estadio Nacional', disciplina: 'Fútbol', temporada: 'Temporada 2026', vacantes: 30, disponibles: 25, textoCompleto: 'Mar–Jue: 3–6 PM – Estadio Nacional – Fútbol – Temporada 2026' },
      { id: 3, turno: 'Lun–Mié–Vie: 8–10 AM', sede: 'Estadio Nacional', disciplina: 'Atletismo', temporada: 'Temporada 2026', vacantes: 40, disponibles: 30, textoCompleto: 'Lun–Mié–Vie: 8–10 AM – Estadio Nacional – Atletismo – Temporada 2026' },
      { id: 4, turno: 'Sáb: 9–12 PM', sede: 'Complejo Chacapampa', disciplina: 'Voleibol', temporada: 'Temporada 2026', vacantes: 25, disponibles: 15, textoCompleto: 'Sáb: 9–12 PM – Complejo Chacapampa – Voleibol – Temporada 2026' },
      { id: 5, turno: 'Mar–Jue: 4–7 PM', sede: 'Estadio Nacional', disciplina: 'Baloncesto', temporada: 'Temporada 2026', vacantes: 35, disponibles: 28, textoCompleto: 'Mar–Jue: 4–7 PM – Estadio Nacional – Baloncesto – Temporada 2026' },
      { id: 6, turno: 'Lun–Vie: 5–7 PM', sede: 'Complejo Chacapampa', disciplina: 'Tenis de campo', temporada: 'Temporada 2026', vacantes: 20, disponibles: 12, textoCompleto: 'Lun–Vie: 5–7 PM – Complejo Chacapampa – Tenis de campo – Temporada 2026' }
    ];
    this.horariosFiltradosAutocomplete = [...this.todosLosHorarios];
  }

  // =========================
  // FILTROS USUARIO
  // =========================

  aplicarFiltrosUsuario(): void {
    this.convocatoriasFiltradasUsuario = this.convocatorias.filter(conv => {
      const matchBusqueda = this.busquedaUsuario === '' ||
        conv.titulo.toLowerCase().includes(this.busquedaUsuario.toLowerCase()) ||
        conv.descripcion.toLowerCase().includes(this.busquedaUsuario.toLowerCase()) ||
        conv.subtitulo.toLowerCase().includes(this.busquedaUsuario.toLowerCase());
      const matchRegion = this.regionSeleccionadaUsuario === '' || conv.region === this.regionSeleccionadaUsuario;
      const matchSede = this.sedeSeleccionadaUsuario === '' || conv.sede === this.sedeSeleccionadaUsuario;
      const matchDeporte = this.deporteSeleccionadoUsuario === '' || conv.deporte === this.deporteSeleccionadoUsuario;
      const matchTipo = this.filtroTipoUsuario === '' || conv.tipo === this.filtroTipoUsuario;
      return matchBusqueda && matchRegion && matchSede && matchDeporte && matchTipo;
    });
    this.totalConvocatoriasUsuario = this.convocatoriasFiltradasUsuario.length;
    this.pageIndexUsuario = 0;
    this.actualizarPaginacionUsuario();
  }

  onDeporteChange(): void {
    this.aplicarFiltrosUsuario();
    if (this.deporteSeleccionadoUsuario && !this.deportesMostrados.has(this.deporteSeleccionadoUsuario)) {
      const deporteInfo = this.deportesInfo[this.deporteSeleccionadoUsuario];
      if (deporteInfo) {
        this.deporteInfoActual = deporteInfo;
        this.mostrarModalDeporte = true;
        this.deportesMostrados.add(this.deporteSeleccionadoUsuario);
      }
    }
  }

  cerrarModalDeporte(): void {
    this.mostrarModalDeporte = false;
    this.deporteInfoActual = null;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.mostrarModalDeporte) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  limpiarFiltrosUsuario(): void {
    this.busquedaUsuario = '';
    this.regionSeleccionadaUsuario = '';
    this.sedeSeleccionadaUsuario = '';
    this.deporteSeleccionadoUsuario = '';
    this.filtroTipoUsuario = '';
    this.aplicarFiltrosUsuario();
  }

  // =========================
  // FILTROS GESTIÓN
  // =========================

  aplicarFiltrosGestion(): void {
    this.convocatoriasFiltradasGestion = this.convocatorias.filter(conv => {
      const matchBusqueda = this.busquedaGestion === '' ||
        conv.titulo.toLowerCase().includes(this.busquedaGestion.toLowerCase()) ||
        conv.descripcion.toLowerCase().includes(this.busquedaGestion.toLowerCase()) ||
        conv.subtitulo.toLowerCase().includes(this.busquedaGestion.toLowerCase());
      const matchRegion = this.regionSeleccionadaGestion === '' || conv.region === this.regionSeleccionadaGestion;
      const matchSede = this.sedeSeleccionadaGestion === '' || conv.sede === this.sedeSeleccionadaGestion;
      const matchDeporte = this.deporteSeleccionadoGestion === '' || conv.deporte === this.deporteSeleccionadoGestion;
      const matchTipo = this.filtroTipoGestion === '' || conv.tipo === this.filtroTipoGestion;
      return matchBusqueda && matchRegion && matchSede && matchDeporte && matchTipo;
    });
    this.totalConvocatoriasGestion = this.convocatoriasFiltradasGestion.length;
    this.pageIndexGestion = 0;
    this.actualizarPaginacionGestion();
  }

  limpiarFiltrosGestion(): void {
    this.busquedaGestion = '';
    this.regionSeleccionadaGestion = '';
    this.sedeSeleccionadaGestion = '';
    this.deporteSeleccionadoGestion = '';
    this.filtroTipoGestion = '';
    this.aplicarFiltrosGestion();
  }

  // =========================
  // PAGINACIÓN
  // =========================

  actualizarPaginacionUsuario(): void {
    const inicio = this.pageIndexUsuario * this.pageSizeUsuario;
    const fin = inicio + this.pageSizeUsuario;
    this.convocatoriasPaginadasUsuario = this.convocatoriasFiltradasUsuario.slice(inicio, fin);
  }

  cambiarPaginaUsuario(event: any): void {
    this.pageIndexUsuario = event.pageIndex;
    this.pageSizeUsuario = event.pageSize;
    this.actualizarPaginacionUsuario();
  }

  actualizarPaginacionGestion(): void {
    const inicio = this.pageIndexGestion * this.pageSizeGestion;
    const fin = inicio + this.pageSizeGestion;
    this.convocatoriasPaginadasGestion = this.convocatoriasFiltradasGestion.slice(inicio, fin);
  }

  cambiarPaginaGestion(event: any): void {
    this.pageIndexGestion = event.pageIndex;
    this.pageSizeGestion = event.pageSize;
    this.actualizarPaginacionGestion();
  }

  // =========================
  // AUTOCOMPLETE DE HORARIOS
  // =========================

  displayHorario(horario: Horario | null): string {
    return horario ? horario.turno : '';
  }

  onHorarioSelected(event: MatAutocompleteSelectedEvent): void {
    this.horarioTemporal = event.option.value;
  }

  filtrarHorariosAutocomplete(): void {
    const texto = this.horarioSeleccionadoTexto;
    if (!texto || texto.trim() === '') {
      this.horariosFiltradosAutocomplete = [...this.todosLosHorarios];
      return;
    }
    const busquedaLower = texto.toLowerCase().trim();
    this.horariosFiltradosAutocomplete = this.todosLosHorarios.filter(horario =>
      (horario.textoCompleto && horario.textoCompleto.toLowerCase().includes(busquedaLower)) ||
      horario.turno.toLowerCase().includes(busquedaLower) ||
      horario.sede.toLowerCase().includes(busquedaLower) ||
      horario.disciplina.toLowerCase().includes(busquedaLower) ||
      horario.temporada.toLowerCase().includes(busquedaLower)
    );
  }

  agregarHorario(): void {
    if (!this.horarioTemporal) return;
    const yaAgregado = this.horariosAgregados.some(h => h.id === this.horarioTemporal!.id);
    if (yaAgregado) {
      this.mostrarMensajeFlotante('error', 'Este horario ya ha sido agregado');
      return;
    }
    this.horariosAgregados.push(this.horarioTemporal);
    this.horarioSeleccionadoTexto = '';
    this.horarioTemporal = null;
    this.horariosFiltradosAutocomplete = [...this.todosLosHorarios];
    this.mostrarMensajeFlotante('success', 'Horario agregado correctamente');
  }

  eliminarHorario(horario: Horario): void {
    const index = this.horariosAgregados.findIndex(h => h.id === horario.id);
    if (index !== -1) {
      this.horariosAgregados.splice(index, 1);
      this.mostrarMensajeFlotante('success', 'Horario eliminado');
    }
  }

  // =========================
  // NAVEGACIÓN DE HORARIOS
  // =========================

  tieneMultiplesHorarios(conv: Convocatoria): boolean {
    return conv.horarios && conv.horarios.length > 1;
  }

  getHorarioActual(conv: Convocatoria): Horario {
    if (!conv.horarios || conv.horarios.length === 0) {
      return { id: 0, turno: 'Sin horario', sede: '', disciplina: '', temporada: '', vacantes: 0, disponibles: 0 };
    }
    const index = conv.horarioActual || 0;
    return conv.horarios[index];
  }

  anteriorHorario(conv: Convocatoria): void {
    if (!conv.horarios || conv.horarios.length === 0) return;
    if (conv.horarioActual === undefined) conv.horarioActual = 0;
    conv.horarioActual = (conv.horarioActual - 1 + conv.horarios.length) % conv.horarios.length;
  }

  siguienteHorario(conv: Convocatoria): void {
    if (!conv.horarios || conv.horarios.length === 0) return;
    if (conv.horarioActual === undefined) conv.horarioActual = 0;
    conv.horarioActual = (conv.horarioActual + 1) % conv.horarios.length;
  }

  getTotalDisponibles(conv: Convocatoria): number {
    if (!conv.horarios || conv.horarios.length === 0) return 0;
    return conv.horarios.reduce((total, horario) => total + horario.disponibles, 0);
  }

  getTotalVacantes(conv: Convocatoria): number {
    if (!conv.horarios || conv.horarios.length === 0) return 0;
    return conv.horarios.reduce((total, horario) => total + horario.vacantes, 0);
  }

  getCuposColor(disponibles: number, vacantes: number): string {
    const porcentaje = (disponibles / vacantes) * 100;
    if (porcentaje < 30) return 'linear-gradient(135deg, #f44336, #d32f2f)';
    if (porcentaje < 60) return 'linear-gradient(135deg, #ff9800, #f57c00)';
    return 'linear-gradient(135deg, #4caf50, #388e3c)';
  }

  // =========================
  // ACCIONES
  // =========================

  inscribirse(conv: Convocatoria): void {
    if (conv.estado === 'cerrada') {
      this.mostrarMensajeFlotante('error', 'Esta convocatoria se encuentra cerrada');
      return;
    }
    this.mostrarMensajeFlotante('success', `Redirigiendo a inscripción de: ${conv.titulo}`);
  }

  compartir(conv: Convocatoria): void {
    const url = `${window.location.origin}/convocatorias/${conv.id_convocatoria}`;
    if (navigator.share) {
      navigator.share({ title: conv.titulo, text: conv.descripcion, url: url })
        .then(() => this.mostrarMensajeFlotante('success', 'Compartido exitosamente'))
        .catch(() => this.copiarAlPortapapeles(url));
    } else {
      this.copiarAlPortapapeles(url);
    }
  }

  copiarAlPortapapeles(texto: string): void {
    navigator.clipboard.writeText(texto)
      .then(() => this.mostrarMensajeFlotante('success', 'Enlace copiado al portapapeles'))
      .catch(() => this.mostrarMensajeFlotante('error', 'Error al copiar enlace'));
  }

  verPreview(conv: Convocatoria): void {
    this.convocatoriaPreview = { ...conv };
    this.mostrarPreview = true;
  }

  cerrarPreview(): void {
    this.mostrarPreview = false;
    this.convocatoriaPreview = null;
  }

  // =========================
  // MODO GESTIÓN
  // =========================

  toggleModoGestion(): void {
    this.modoGestion = !this.modoGestion;
    if (this.modoGestion) {
      this.pageIndexGestion = 0;
      this.actualizarPaginacionGestion();
    } else {
      this.pageIndexUsuario = 0;
      this.actualizarPaginacionUsuario();
    }
  }

  newConvocatoria(): void {
    this.modoEdicion = false;
    this.convocatoriaEditando = null;
    this.nuevaConvocatoria = this.crearConvocatoriaVacia();
    this.horariosAgregados = [];
    this.imagenSeleccionada = null;
    this.imagenPreview = '';
    this.erroresFormulario = {};
    this.horarioSeleccionadoTexto = '';
    this.horarioTemporal = null;
    this.horariosFiltradosAutocomplete = [...this.todosLosHorarios];
    this.mostrarFormulario = true;
  }

  editarConvocatoria(conv: Convocatoria): void {
    this.modoEdicion = true;
    this.convocatoriaEditando = conv;
    this.nuevaConvocatoria = { ...conv };
    this.horariosAgregados = [...conv.horarios];
    this.imagenPreview = conv.urlimagen;
    this.erroresFormulario = {};
    this.horarioSeleccionadoTexto = '';
    this.horarioTemporal = null;
    this.horariosFiltradosAutocomplete = [...this.todosLosHorarios];
    this.mostrarFormulario = true;
  }

  confirmarEliminar(conv: Convocatoria): void {
    this.abrirConfirmacion(
      'Eliminar Convocatoria',
      `¿Está seguro de eliminar "${conv.titulo}"? Esta acción no se puede deshacer.`,
      () => this.eliminarConvocatoria(conv)
    );
  }

  eliminarConvocatoria(conv: Convocatoria): void {
    this.mostrarMensajeFlotante('loading', 'Eliminando convocatoria...');
    setTimeout(() => {
      const index = this.convocatorias.findIndex(c => c.id_convocatoria === conv.id_convocatoria);
      if (index !== -1) {
        this.convocatorias.splice(index, 1);
        this.aplicarFiltrosUsuario();
        this.aplicarFiltrosGestion();
        this.mostrarMensajeFlotante('success', 'Convocatoria eliminada exitosamente');
      }
    }, 800);
  }

  // =========================
  // FORMULARIO
  // =========================

  crearConvocatoriaVacia(): Convocatoria {
    return {
      id_convocatoria: 0,
      titulo: '',
      subtitulo: '',
      descripcion: '',
      urlimagen: '',
      deporte: '',
      tipo: 'deporte',
      horarios: [],
      numvacantes: 0,
      numdisponibles: 0,
      numinscritos: 0,
      estado: 'activa',
      region: '',
      sede: '',
      fechacreada: null,
      horarioActual: 0
    };
  }

  seleccionarImagen(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      this.imagenSeleccionada = archivo;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(archivo);
    }
  }

  validarFormulario(): boolean {
    this.erroresFormulario = {};
    let valido = true;

    if (!this.nuevaConvocatoria.titulo || this.nuevaConvocatoria.titulo.trim() === '') {
      this.erroresFormulario['titulo'] = true;
      valido = false;
    }
    if (!this.nuevaConvocatoria.subtitulo || this.nuevaConvocatoria.subtitulo.trim() === '') {
      this.erroresFormulario['subtitulo'] = true;
      valido = false;
    }
    if (!this.nuevaConvocatoria.descripcion || this.nuevaConvocatoria.descripcion.trim() === '') {
      this.erroresFormulario['descripcion'] = true;
      valido = false;
    }
    if (this.horariosAgregados.length === 0) {
      this.erroresFormulario['horarios'] = true;
      valido = false;
      this.mostrarMensajeFlotante('error', 'Debe agregar al menos un horario');
    }
    if (this.nuevaConvocatoria.numvacantes <= 0) {
      this.erroresFormulario['numvacantes'] = true;
      valido = false;
    }

    return valido;
  }

  guardarConvocatoria(): void {
    if (!this.validarFormulario()) {
      this.mostrarMensajeFlotante('error', 'Por favor complete todos los campos obligatorios');
      return;
    }

    this.nuevaConvocatoria.horarios = [...this.horariosAgregados];
    // Calcular disponibles basado en horarios
    this.nuevaConvocatoria.numdisponibles = this.horariosAgregados.reduce((sum, h) => sum + h.disponibles, 0);
    
    this.mostrarMensajeFlotante('loading', this.modoEdicion ? 'Actualizando convocatoria...' : 'Guardando convocatoria...');

    setTimeout(() => {
      if (this.modoEdicion && this.convocatoriaEditando) {
        const index = this.convocatorias.findIndex(c => c.id_convocatoria === this.convocatoriaEditando!.id_convocatoria);
        if (index !== -1) {
          this.convocatorias[index] = { ...this.nuevaConvocatoria };
        }
        this.mostrarMensajeFlotante('success', 'Convocatoria actualizada exitosamente');
      } else {
        this.nuevaConvocatoria.id_convocatoria = this.convocatorias.length + 1;
        this.nuevaConvocatoria.fechacreada = new Date();
        this.convocatorias.unshift({ ...this.nuevaConvocatoria });
        this.mostrarMensajeFlotante('success', 'Convocatoria creada exitosamente');
      }
      this.cerrarFormulario();
      this.aplicarFiltrosUsuario();
      this.aplicarFiltrosGestion();
    }, 1000);
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.modoEdicion = false;
    this.convocatoriaEditando = null;
    this.nuevaConvocatoria = this.crearConvocatoriaVacia();
    this.horariosAgregados = [];
    this.imagenSeleccionada = null;
    this.imagenPreview = '';
    this.horarioSeleccionadoTexto = '';
    this.horarioTemporal = null;
    this.horariosFiltradosAutocomplete = [...this.todosLosHorarios];
  }

  // =========================
  // MENSAJES Y CONFIRMACIONES
  // =========================

  mostrarMensajeFlotante(tipo: 'success' | 'error' | 'loading', texto: string): void {
    this.tipoMensaje = tipo;
    this.textoMensaje = texto;
    this.mostrarMensajeCentral = true;
    if (tipo !== 'loading') {
      setTimeout(() => { this.mostrarMensajeCentral = false; }, 3000);
    }
  }

  abrirConfirmacion(titulo: string, mensaje: string, accion: () => void): void {
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
    this.convocatorias.forEach(conv => {
      conv.estado = conv.numdisponibles === 0 ? 'cerrada' : 'activa';
    });
  }

  getEstadoClass(estado: string): string {
    return estado === 'activa' ? 'estado-activa' : 'estado-cerrada';
  }

  getEstadoTexto(estado: string): string {
    return estado === 'activa' ? 'Activa' : 'Cerrada';
  }

  getTipoTexto(tipo: string): string {
    return tipo === 'paradeporte' ? 'Para Deporte' : 'Deporte';
  }

  getTipoClass(tipo: string): string {
    return tipo === 'paradeporte' ? 'tipo-paradeporte' : 'tipo-deporte';
  }

  // =========================
  // DATOS DE EJEMPLO
  // =========================

  obtenerDatosEjemplo(): Convocatoria[] {
    const convocatorias: Convocatoria[] = [];
    let id = 1;

    const deportesNormales = ['Rugby', 'Tenis de campo', 'Judo', 'Voleibol', 'Futbol', 'Baloncesto', 'Atletismo', 'Pickleball'];
    
    deportesNormales.forEach(deporte => {
      convocatorias.push({
        id_convocatoria: id++,
        titulo: `${deporte}`,
        subtitulo: 'Temporada 2026',
        descripcion: `Inscripciones abiertas para ${deporte}. ¡Totalmente gratuito!`,
        urlimagen: 'https://i.imgur.com/srcVUcm.png',
        deporte: deporte,
        tipo: 'deporte',
        horarios: [{ id: id, turno: 'Lun-Mié-Vie: 3-6 PM', sede: 'Estadio Nacional', disciplina: deporte, temporada: 'Temporada 2026', vacantes: 30, disponibles: 20, textoCompleto: `Lun-Mié-Vie – 3-6 PM – Estadio Nacional – ${deporte}` }],
        numvacantes: 30,
        numdisponibles: 20,
        numinscritos: 10,
        estado: 'activa',
        region: 'Lima',
        sede: 'Estadio Nacional',
        fechacreada: new Date(),
        horarioActual: 0
      });
    });

    deportesNormales.forEach(deporte => {
      convocatorias.push({
        id_convocatoria: id++,
        titulo: `${deporte}`,
        subtitulo: 'Temporada 2026',
        descripcion: `Inscripciones abiertas para ${deporte}. Múltiples horarios.`,
        urlimagen: 'https://i.imgur.com/srcVUcm.png',
        deporte: deporte,
        tipo: 'deporte',
        horarios: [
          { id: id * 10, turno: 'Mar-Jue: 3-6 PM', sede: 'Estadio Nacional', disciplina: deporte, temporada: 'Temporada 2026', vacantes: 30, disponibles: 15, textoCompleto: `Mar-Jue: 3-6 PM – ${deporte}` },
          { id: id * 10 + 1, turno: 'Lun-Mié-Vie: 8-10 AM', sede: 'Estadio Nacional', disciplina: deporte, temporada: 'Temporada 2026', vacantes: 25, disponibles: 18, textoCompleto: `Lun-Mié-Vie: 8-10 AM – ${deporte}` }
        ],
        numvacantes: 55,
        numdisponibles: 33,
        numinscritos: 22,
        estado: 'activa',
        region: 'Lima',
        sede: 'Estadio Nacional',
        fechacreada: new Date(),
        horarioActual: 0
      });
    });

    const paraDeportes = [
      { deporte: 'Atletismo', nombre: 'Para Atletismo (Atletismo Adaptado)' },
      { deporte: 'Tenis de campo', nombre: 'Tenis de Campo para Discapacidad Intelectual' },
      { deporte: 'Futbol', nombre: 'Futbol de Ciego' },
      { deporte: 'Judo', nombre: 'Para Judo' }
    ];

    paraDeportes.forEach(pd => {
      convocatorias.push({
        id_convocatoria: id++,
        titulo: pd.nombre,
        subtitulo: 'Temporada 2026',
        descripcion: `Programa inclusivo de ${pd.nombre} para personas con discapacidad.`,
        urlimagen: 'https://i.imgur.com/srcVUcm.png',
        deporte: pd.deporte,
        tipo: 'paradeporte',
        horarios: [{ id: id * 100, turno: 'Lun-Mié-Vie: 3-6 PM', sede: 'Estadio Nacional', disciplina: pd.deporte, temporada: 'Temporada 2026', vacantes: 25, disponibles: 18, textoCompleto: `Lun-Mié-Vie: 3-6 PM – ${pd.deporte}` }],
        numvacantes: 25,
        numdisponibles: 18,
        numinscritos: 7,
        estado: 'activa',
        region: 'Lima',
        sede: 'Estadio Nacional',
        fechacreada: new Date(),
        horarioActual: 0
      });
    });

    convocatorias.push(
      {
        id_convocatoria: id++,
        titulo: 'Vóley IPD Chacapampa',
        subtitulo: 'ACADEMIA IPD',
        descripcion: 'Inscripciones abiertas para vóley.',
        urlimagen: 'https://i.imgur.com/srcVUcm.png',
        deporte: 'Voleibol',
        tipo: 'deporte',
        horarios: [{ id: id * 1000, turno: 'Lun-Mié-Vie: 3-6 PM', sede: 'Complejo Chacapampa', disciplina: 'Voleibol', temporada: 'Temporada 2026', vacantes: 60, disponibles: 42, textoCompleto: 'Lun-Mié-Vie: 3-6 PM – Voleibol' }],
        numvacantes: 60,
        numdisponibles: 42,
        numinscritos: 18,
        estado: 'activa',
        region: 'Lima',
        sede: 'Complejo Chacapampa',
        fechacreada: new Date(),
        horarioActual: 0
      },
      {
        id_convocatoria: id++,
        titulo: 'Cusco Multideporte 2024',
        subtitulo: 'ACADEMIA IPD',
        descripcion: 'Programa multideportivo.',
        urlimagen: 'https://i.imgur.com/srcVUcm.png',
        deporte: 'Futbol',
        tipo: 'deporte',
        horarios: [{ id: id * 1000, turno: 'Mar-Jue: 3-6 PM', sede: 'Complejo Deportivo Cusco', disciplina: 'Futbol', temporada: 'Temporada 2026', vacantes: 150, disponibles: 0, textoCompleto: 'Mar-Jue: 3-6 PM – Futbol' }],
        numvacantes: 150,
        numdisponibles: 0,
        numinscritos: 150,
        estado: 'cerrada',
        region: 'Cusco',
        sede: 'Complejo Deportivo Cusco',
        fechacreada: new Date(),
        horarioActual: 0
      }
    );

    return convocatorias;
  }
}