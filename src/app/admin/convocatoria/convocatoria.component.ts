import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
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
import { map, Observable, startWith } from 'rxjs';

export interface Horario {
  id: number;
  dias: string;
  hora: string;
  sede: string;
  disciplina: string;
  temporada: string;
  vacantes: number;
  disponibles: number;
  textoCompleto?: string;
}

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
  temporada?: string;
  fechacreada?: Date | null;
  isFlipped?: boolean;
}

export interface DeporteInfo {
  nombre: string;
  imagen: string;
  descripcion: string;
}

@Component({
  selector: 'app-convocatoria',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatChipsModule,
    MatBadgeModule, MatTooltipModule, MatProgressSpinnerModule, MatTableModule,
    MatPaginatorModule, NgIf, MatCheckboxModule, MatButtonToggleModule,
    MatAutocompleteModule, MatProgressBarModule
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

  convocatorias: Convocatoria[] = [];
  
  // USUARIO
  convocatoriasFiltradasUsuario: Convocatoria[] = [];
  convocatoriasPaginadasUsuario: Convocatoria[] = [];
  pageSizeUsuario: number = 6;
  pageIndexUsuario: number = 0;
  totalConvocatoriasUsuario: number = 0;

  // GESTIÓN
  convocatoriasFiltradasGestion: Convocatoria[] = [];
  convocatoriasPaginadasGestion: Convocatoria[] = [];
  pageSizeGestion: number = 10;
  pageIndexGestion: number = 0;
  totalConvocatoriasGestion: number = 0;

  pageSizeOptions: number[] = [6, 12, 18, 24];

  // FILTROS USUARIO
  busquedaUsuario: string = '';
  regionSeleccionadaUsuario: string = '';
  sedeSeleccionadaUsuario: string = '';
  deporteSeleccionadoUsuario: string = '';
  filtroTipoUsuario: string = '';

  regionesDisponiblesUsuario: string[] = [];
  sedesDisponiblesUsuario: string[] = [];
  deportesDisponiblesUsuario: string[] = [];
  tiposDisponiblesUsuario: string[] = [];

  // FILTROS GESTIÓN
  busquedaGestion: string = '';
  regionSeleccionadaGestion: string = '';
  sedeSeleccionadaGestion: string = '';
  deporteSeleccionadoGestion: string = '';
  filtroTipoGestion: string = '';

  regionesDisponiblesGestion: string[] = [];
  sedesDisponiblesGestion: string[] = [];
  deportesDisponiblesGestion: string[] = [];
  tiposDisponiblesGestion: string[] = [];

  tiposConvocatoria = [
    { value: '', label: 'Todos los tipos' },
    { value: 'deporte', label: 'Deporte' },
    { value: 'paradeporte', label: 'Para Deporte' }
  ];

  // ESTADOS
  cargando: boolean = true;
  modoGestion: boolean = false;
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  convocatoriaEditando: Convocatoria | null = null;
  mostrarPreview: boolean = false;
  convocatoriaPreview: Convocatoria | null = null;

  // MODAL DEPORTE
  mostrarModalDeporte: boolean = false;
  deporteInfoActual: DeporteInfo | null = null;
  ultimoDeporteSeleccionado: string = '';

  deportesInfo: { [key: string]: DeporteInfo } = {
    'Rugby': { nombre: 'Rugby', imagen: 'https://i.imgur.com/srcVUcm.png', descripcion: 'El rugby es un deporte de contacto en equipo que combina fuerza, velocidad, resistencia y trabajo en equipo. En la Academia IPD, desarrollamos habilidades técnicas y tácticas fundamentales.' },
    'Tenis de campo': { nombre: 'Tenis de Campo', imagen: 'https://i.imgur.com/srcVUcm.png', descripcion: 'El tenis de campo es un deporte de raqueta que mejora la coordinación, agilidad y concentración. Nuestro programa ofrece formación integral para principiantes y deportistas en desarrollo.' },
    'Judo': { nombre: 'Judo', imagen: 'https://i.imgur.com/srcVUcm.png', descripcion: 'El judo es un arte marcial japonés que desarrolla la fuerza, flexibilidad y disciplina mental. En nuestras clases, los participantes aprenden técnicas de proyección, control y caída segura.' },
    'Voleibol': { nombre: 'Voleibol', imagen: 'https://i.imgur.com/srcVUcm.png', descripcion: 'El voleibol es un deporte de equipo dinámico que desarrolla reflejos, coordinación y comunicación. El programa incluye formación técnica en saque, recepción, colocación y remate.' },
    'Futbol': { nombre: 'Fútbol', imagen: 'https://i.imgur.com/srcVUcm.png', descripcion: 'El fútbol es el deporte más popular del mundo, ideal para desarrollar trabajo en equipo, resistencia y habilidades motoras.' },
    'Baloncesto': { nombre: 'Baloncesto', imagen: 'https://i.imgur.com/srcVUcm.png', descripcion: 'El baloncesto combina velocidad, agilidad y estrategia. Trabajamos habilidades de dribling, pase, tiro y defensa.' },
    'Atletismo': { nombre: 'Atletismo', imagen: 'https://i.imgur.com/srcVUcm.png', descripcion: 'El atletismo es la base de todos los deportes, desarrollando velocidad, resistencia, fuerza y coordinación.' },
    'Pickleball': { nombre: 'Pickleball', imagen: 'https://i.imgur.com/srcVUcm.png', descripcion: 'El pickleball combina elementos del tenis, bádminton y ping pong. Es accesible para todas las edades y niveles.' }
  };

  // MENSAJES
  mostrarMensajeCentral: boolean = false;
  tipoMensaje: 'success' | 'error' | 'loading' = 'success';
  textoMensaje: string = '';

  // CONFIRMACIÓN
  mostrarConfirmacion: boolean = false;
  tituloConfirmacion: string = '';
  mensajeConfirmacion: string = '';
  accionConfirmacion: (() => void) | null = null;

  // FORMULARIO
  nuevaConvocatoria: Convocatoria = this.crearConvocatoriaVacia();
  imagenSeleccionada: File | null = null;
  imagenPreview: string = '';
  erroresFormulario: { [key: string]: boolean } = {};

  todosLosHorarios: Horario[] = [];
  horariosFiltradosAutocomplete: Horario[] = [];
  horarioSeleccionadoTexto: string = '';
  horarioTemporal: Horario | null = null;
  horariosAgregados: Horario[] = [];

  constructor() { }

  ngOnInit(): void {
    this.cargarConvocatorias();
    this.cargarHorariosDisponibles();

    this.filteredOptions = this.my.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  cargarConvocatorias(): void {
    this.cargando = true;
    setTimeout(() => {
      this.convocatorias = this.obtenerDatosEjemplo();
      this.inicializarFiltrosUsuario();
      this.inicializarFiltrosGestion();
      this.aplicarFiltrosUsuario();
      this.aplicarFiltrosGestion();
      this.cargando = false;
    }, 500);
  }

  cargarHorariosDisponibles(): void {
    this.todosLosHorarios = [
      { id: 1, dias: 'Lunes - Miércoles - Viernes', hora: '3 - 6 PM', sede: 'Estadio Nacional', disciplina: 'Rugby', temporada: 'Academia IPD 2026', vacantes: 30, disponibles: 20, textoCompleto: 'Lun-Mié-Vie: 3-6 PM – Estadio Nacional' },
      { id: 2, dias: 'Martes - Jueves', hora: '3 - 6 PM', sede: 'Estadio Nacional', disciplina: 'Fútbol', temporada: 'Academia IPD 2026', vacantes: 30, disponibles: 25, textoCompleto: 'Mar-Jue: 3-6 PM – Estadio Nacional' },
      { id: 3, dias: 'Lunes - Miércoles - Viernes', hora: '8 - 10 AM', sede: 'Estadio Nacional', disciplina: 'Atletismo', temporada: 'Academia IPD 2026', vacantes: 40, disponibles: 30, textoCompleto: 'Lun-Mié-Vie: 8-10 AM – Estadio Nacional' },
      { id: 4, dias: 'Sábado', hora: '9 AM - 12 PM', sede: 'Complejo Chacapampa', disciplina: 'Voleibol', temporada: 'Academia IPD 2026', vacantes: 25, disponibles: 15, textoCompleto: 'Sáb: 9-12 PM – Complejo Chacapampa' },
      { id: 5, dias: 'Martes - Jueves', hora: '4 - 7 PM', sede: 'Estadio Nacional', disciplina: 'Baloncesto', temporada: 'Academia IPD 2026', vacantes: 35, disponibles: 28, textoCompleto: 'Mar-Jue: 4-7 PM – Estadio Nacional' }
    ];
    this.horariosFiltradosAutocomplete = [...this.todosLosHorarios];
  }

  // ========================= FILTROS INTERCONECTADOS USUARIO =========================

  inicializarFiltrosUsuario(): void {
    this.actualizarOpcionesFiltrosUsuario();
  }

  actualizarOpcionesFiltrosUsuario(): void {
    let base = this.convocatorias;
    if (this.busquedaUsuario) {
      const b = this.busquedaUsuario.toLowerCase();
      base = base.filter(c => c.titulo.toLowerCase().includes(b) || c.descripcion.toLowerCase().includes(b));
    }

    let pRegion = base;
    if (this.sedeSeleccionadaUsuario) pRegion = pRegion.filter(c => c.sede === this.sedeSeleccionadaUsuario);
    if (this.deporteSeleccionadoUsuario) pRegion = pRegion.filter(c => c.deporte === this.deporteSeleccionadoUsuario);
    if (this.filtroTipoUsuario) pRegion = pRegion.filter(c => c.tipo === this.filtroTipoUsuario);
    this.regionesDisponiblesUsuario = [...new Set(pRegion.map(c => c.region).filter(r => r))].sort() as string[];

    let pSede = base;
    if (this.regionSeleccionadaUsuario) pSede = pSede.filter(c => c.region === this.regionSeleccionadaUsuario);
    if (this.deporteSeleccionadoUsuario) pSede = pSede.filter(c => c.deporte === this.deporteSeleccionadoUsuario);
    if (this.filtroTipoUsuario) pSede = pSede.filter(c => c.tipo === this.filtroTipoUsuario);
    this.sedesDisponiblesUsuario = [...new Set(pSede.map(c => c.sede).filter(s => s))].sort() as string[];

    let pDeporte = base;
    if (this.regionSeleccionadaUsuario) pDeporte = pDeporte.filter(c => c.region === this.regionSeleccionadaUsuario);
    if (this.sedeSeleccionadaUsuario) pDeporte = pDeporte.filter(c => c.sede === this.sedeSeleccionadaUsuario);
    if (this.filtroTipoUsuario) pDeporte = pDeporte.filter(c => c.tipo === this.filtroTipoUsuario);
    this.deportesDisponiblesUsuario = [...new Set(pDeporte.map(c => c.deporte).filter(d => d))].sort() as string[];

    let pTipo = base;
    if (this.regionSeleccionadaUsuario) pTipo = pTipo.filter(c => c.region === this.regionSeleccionadaUsuario);
    if (this.sedeSeleccionadaUsuario) pTipo = pTipo.filter(c => c.sede === this.sedeSeleccionadaUsuario);
    if (this.deporteSeleccionadoUsuario) pTipo = pTipo.filter(c => c.deporte === this.deporteSeleccionadoUsuario);
    this.tiposDisponiblesUsuario = [...new Set(pTipo.map(c => c.tipo))];
  }

  aplicarFiltrosUsuario(): void {
    this.convocatoriasFiltradasUsuario = this.convocatorias.filter(conv => {
      const matchBusqueda = !this.busquedaUsuario || conv.titulo.toLowerCase().includes(this.busquedaUsuario.toLowerCase()) || conv.descripcion.toLowerCase().includes(this.busquedaUsuario.toLowerCase());
      const matchRegion = !this.regionSeleccionadaUsuario || conv.region === this.regionSeleccionadaUsuario;
      const matchSede = !this.sedeSeleccionadaUsuario || conv.sede === this.sedeSeleccionadaUsuario;
      const matchDeporte = !this.deporteSeleccionadoUsuario || conv.deporte === this.deporteSeleccionadoUsuario;
      const matchTipo = !this.filtroTipoUsuario || conv.tipo === this.filtroTipoUsuario;
      return matchBusqueda && matchRegion && matchSede && matchDeporte && matchTipo;
    });
    this.totalConvocatoriasUsuario = this.convocatoriasFiltradasUsuario.length;
    this.pageIndexUsuario = 0;
    this.actualizarPaginacionUsuario();
    this.actualizarOpcionesFiltrosUsuario();
  }

  onFiltroChangeUsuario(): void {
    this.aplicarFiltrosUsuario();
  }

  onDeporteChangeUsuario(): void {
    const deporteActual = this.deporteSeleccionadoUsuario;
    this.aplicarFiltrosUsuario();
    if (deporteActual && deporteActual !== this.ultimoDeporteSeleccionado) {
      const info = this.deportesInfo[deporteActual];
      if (info) {
        this.deporteInfoActual = info;
        this.mostrarModalDeporte = true;
      }
    }
    this.ultimoDeporteSeleccionado = deporteActual;
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
    this.ultimoDeporteSeleccionado = '';
    this.aplicarFiltrosUsuario();
  }

  // ========================= FILTROS INTERCONECTADOS GESTIÓN =========================

  inicializarFiltrosGestion(): void {
    this.actualizarOpcionesFiltrosGestion();
  }

  actualizarOpcionesFiltrosGestion(): void {
    let base = this.convocatorias;
    if (this.busquedaGestion) {
      const b = this.busquedaGestion.toLowerCase();
      base = base.filter(c => c.titulo.toLowerCase().includes(b) || c.descripcion.toLowerCase().includes(b));
    }

    let pRegion = base;
    if (this.sedeSeleccionadaGestion) pRegion = pRegion.filter(c => c.sede === this.sedeSeleccionadaGestion);
    if (this.deporteSeleccionadoGestion) pRegion = pRegion.filter(c => c.deporte === this.deporteSeleccionadoGestion);
    if (this.filtroTipoGestion) pRegion = pRegion.filter(c => c.tipo === this.filtroTipoGestion);
    this.regionesDisponiblesGestion = [...new Set(pRegion.map(c => c.region).filter(r => r))].sort() as string[];

    let pSede = base;
    if (this.regionSeleccionadaGestion) pSede = pSede.filter(c => c.region === this.regionSeleccionadaGestion);
    if (this.deporteSeleccionadoGestion) pSede = pSede.filter(c => c.deporte === this.deporteSeleccionadoGestion);
    if (this.filtroTipoGestion) pSede = pSede.filter(c => c.tipo === this.filtroTipoGestion);
    this.sedesDisponiblesGestion = [...new Set(pSede.map(c => c.sede).filter(s => s))].sort() as string[];

    let pDeporte = base;
    if (this.regionSeleccionadaGestion) pDeporte = pDeporte.filter(c => c.region === this.regionSeleccionadaGestion);
    if (this.sedeSeleccionadaGestion) pDeporte = pDeporte.filter(c => c.sede === this.sedeSeleccionadaGestion);
    if (this.filtroTipoGestion) pDeporte = pDeporte.filter(c => c.tipo === this.filtroTipoGestion);
    this.deportesDisponiblesGestion = [...new Set(pDeporte.map(c => c.deporte).filter(d => d))].sort() as string[];

    let pTipo = base;
    if (this.regionSeleccionadaGestion) pTipo = pTipo.filter(c => c.region === this.regionSeleccionadaGestion);
    if (this.sedeSeleccionadaGestion) pTipo = pTipo.filter(c => c.sede === this.sedeSeleccionadaGestion);
    if (this.deporteSeleccionadoGestion) pTipo = pTipo.filter(c => c.deporte === this.deporteSeleccionadoGestion);
    this.tiposDisponiblesGestion = [...new Set(pTipo.map(c => c.tipo))];
  }

  aplicarFiltrosGestion(): void {
    this.convocatoriasFiltradasGestion = this.convocatorias.filter(conv => {
      const matchBusqueda = !this.busquedaGestion || conv.titulo.toLowerCase().includes(this.busquedaGestion.toLowerCase()) || conv.descripcion.toLowerCase().includes(this.busquedaGestion.toLowerCase());
      const matchRegion = !this.regionSeleccionadaGestion || conv.region === this.regionSeleccionadaGestion;
      const matchSede = !this.sedeSeleccionadaGestion || conv.sede === this.sedeSeleccionadaGestion;
      const matchDeporte = !this.deporteSeleccionadoGestion || conv.deporte === this.deporteSeleccionadoGestion;
      const matchTipo = !this.filtroTipoGestion || conv.tipo === this.filtroTipoGestion;
      return matchBusqueda && matchRegion && matchSede && matchDeporte && matchTipo;
    });
    this.totalConvocatoriasGestion = this.convocatoriasFiltradasGestion.length;
    this.pageIndexGestion = 0;
    this.actualizarPaginacionGestion();
    this.actualizarOpcionesFiltrosGestion();
  }

  onFiltroChangeGestion(): void {
    this.aplicarFiltrosGestion();
  }

  limpiarFiltrosGestion(): void {
    this.busquedaGestion = '';
    this.regionSeleccionadaGestion = '';
    this.sedeSeleccionadaGestion = '';
    this.deporteSeleccionadoGestion = '';
    this.filtroTipoGestion = '';
    this.aplicarFiltrosGestion();
  }

  // ========================= PAGINACIÓN =========================

  actualizarPaginacionUsuario(): void {
    const inicio = this.pageIndexUsuario * this.pageSizeUsuario;
    this.convocatoriasPaginadasUsuario = this.convocatoriasFiltradasUsuario.slice(inicio, inicio + this.pageSizeUsuario);
  }

  cambiarPaginaUsuario(event: any): void {
    this.pageIndexUsuario = event.pageIndex;
    this.pageSizeUsuario = event.pageSize;
    this.actualizarPaginacionUsuario();
  }

  actualizarPaginacionGestion(): void {
    const inicio = this.pageIndexGestion * this.pageSizeGestion;
    this.convocatoriasPaginadasGestion = this.convocatoriasFiltradasGestion.slice(inicio, inicio + this.pageSizeGestion);
  }

  cambiarPaginaGestion(event: any): void {
    this.pageIndexGestion = event.pageIndex;
    this.pageSizeGestion = event.pageSize;
    this.actualizarPaginacionGestion();
  }

  // ========================= FLIP CARD =========================

  toggleFlipCard(conv: Convocatoria, event: Event): void {
    event.stopPropagation();
    conv.isFlipped = !conv.isFlipped;
  }

  // ========================= OCUPACIÓN =========================

  getPorcentajeOcupacion(conv: Convocatoria): number {
    if (conv.numvacantes === 0) return 100;
    const ocupados = conv.numvacantes - conv.numdisponibles;
    return Math.round((ocupados / conv.numvacantes) * 100);
  }

  getClaseOcupacion(conv: Convocatoria): string {
    const p = this.getPorcentajeOcupacion(conv);
    if (p < 50) return 'ocupacion-baja';
    if (p < 80) return 'ocupacion-media';
    return 'ocupacion-alta';
  }

  getColorBarra(conv: Convocatoria): string {
    const p = this.getPorcentajeOcupacion(conv);
    if (p < 50) return '#4caf50';
    if (p < 80) return '#ff9800';
    return '#f44336';
  }

  // ========================= HORARIOS =========================

  displayHorario(h: Horario | null): string {
    return h ? `${h.dias} - ${h.hora}` : '';
  }

  onHorarioSelected(event: MatAutocompleteSelectedEvent): void {
    this.horarioTemporal = event.option.value;
  }

  filtrarHorariosAutocomplete(): void {
    const t = this.horarioSeleccionadoTexto?.toLowerCase().trim() || '';
    if (!t) {
      this.horariosFiltradosAutocomplete = [...this.todosLosHorarios];
      return;
    }
    this.horariosFiltradosAutocomplete = this.todosLosHorarios.filter(h =>
      h.textoCompleto?.toLowerCase().includes(t) || h.dias.toLowerCase().includes(t) || h.sede.toLowerCase().includes(t)
    );
  }

  agregarHorario(): void {
    if (!this.horarioTemporal) return;
    if (this.horariosAgregados.some(h => h.id === this.horarioTemporal!.id)) {
      this.mostrarMensajeFlotante('error', 'Este horario ya fue agregado');
      return;
    }
    this.horariosAgregados.push(this.horarioTemporal);
    this.horarioSeleccionadoTexto = '';
    this.horarioTemporal = null;
    this.horariosFiltradosAutocomplete = [...this.todosLosHorarios];
    this.mostrarMensajeFlotante('success', 'Horario agregado');
  }

  eliminarHorario(h: Horario): void {
    const i = this.horariosAgregados.findIndex(x => x.id === h.id);
    if (i !== -1) {
      this.horariosAgregados.splice(i, 1);
      this.mostrarMensajeFlotante('success', 'Horario eliminado');
    }
  }

  getTotalDisponibles(c: Convocatoria): number {
    return c.horarios?.reduce((s, h) => s + h.disponibles, 0) || c.numdisponibles;
  }

  getTotalVacantes(c: Convocatoria): number {
    return c.horarios?.reduce((s, h) => s + h.vacantes, 0) || c.numvacantes;
  }

  // ========================= ACCIONES =========================

  inscribirse(conv: Convocatoria, event: Event): void {
    event.stopPropagation();
    if (conv.estado === 'cerrada') {
      this.mostrarMensajeFlotante('error', 'Esta convocatoria está cerrada');
      return;
    }
    this.mostrarMensajeFlotante('success', `Redirigiendo a inscripción: ${conv.titulo}`);
  }

  verPreview(conv: Convocatoria): void {
    this.convocatoriaPreview = { ...conv };
    this.mostrarPreview = true;
  }

  cerrarPreview(): void {
    this.mostrarPreview = false;
    this.convocatoriaPreview = null;
  }

  toggleModoGestion(): void {
    this.modoGestion = !this.modoGestion;
    this.convocatorias.forEach(c => c.isFlipped = false);
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
    this.abrirConfirmacion('Eliminar Convocatoria', `¿Eliminar "${conv.titulo}"?`, () => this.eliminarConvocatoria(conv));
  }

  eliminarConvocatoria(conv: Convocatoria): void {
    this.mostrarMensajeFlotante('loading', 'Eliminando...');
    setTimeout(() => {
      const i = this.convocatorias.findIndex(c => c.id_convocatoria === conv.id_convocatoria);
      if (i !== -1) {
        this.convocatorias.splice(i, 1);
        this.aplicarFiltrosUsuario();
        this.aplicarFiltrosGestion();
        this.mostrarMensajeFlotante('success', 'Eliminada exitosamente');
      }
    }, 800);
  }

  crearConvocatoriaVacia(): Convocatoria {
    return {
      id_convocatoria: 0, titulo: '', subtitulo: '', descripcion: '', urlimagen: '',
      deporte: '', tipo: 'deporte', horarios: [], numvacantes: 0, numdisponibles: 0,
      numinscritos: 0, estado: 'activa', region: '', sede: '', temporada: 'Temporada 2026',
      fechacreada: null, isFlipped: false
    };
  }

  seleccionarImagen(event: any): void {
    const f = event.target.files[0];
    if (f) {
      this.imagenSeleccionada = f;
      const reader = new FileReader();
      reader.onload = (e: any) => { this.imagenPreview = e.target.result; };
      reader.readAsDataURL(f);
    }
  }

  validarFormulario(): boolean {
    this.erroresFormulario = {};
    let v = true;
    if (!this.nuevaConvocatoria.titulo?.trim()) { this.erroresFormulario['titulo'] = true; v = false; }
    if (!this.nuevaConvocatoria.subtitulo?.trim()) { this.erroresFormulario['subtitulo'] = true; v = false; }
    if (!this.nuevaConvocatoria.descripcion?.trim()) { this.erroresFormulario['descripcion'] = true; v = false; }
    if (this.horariosAgregados.length === 0) { this.erroresFormulario['horarios'] = true; v = false; this.mostrarMensajeFlotante('error', 'Agregue al menos un horario'); }
    if (this.nuevaConvocatoria.numvacantes <= 0) { this.erroresFormulario['numvacantes'] = true; v = false; }
    return v;
  }

  guardarConvocatoria(): void {
    if (!this.validarFormulario()) { this.mostrarMensajeFlotante('error', 'Complete todos los campos'); return; }
    this.nuevaConvocatoria.horarios = [...this.horariosAgregados];
    this.nuevaConvocatoria.numdisponibles = this.horariosAgregados.reduce((s, h) => s + h.disponibles, 0);
    this.mostrarMensajeFlotante('loading', this.modoEdicion ? 'Actualizando...' : 'Guardando...');
    setTimeout(() => {
      if (this.modoEdicion && this.convocatoriaEditando) {
        const i = this.convocatorias.findIndex(c => c.id_convocatoria === this.convocatoriaEditando!.id_convocatoria);
        if (i !== -1) this.convocatorias[i] = { ...this.nuevaConvocatoria };
        this.mostrarMensajeFlotante('success', 'Actualizada');
      } else {
        this.nuevaConvocatoria.id_convocatoria = this.convocatorias.length + 1;
        this.nuevaConvocatoria.fechacreada = new Date();
        this.convocatorias.unshift({ ...this.nuevaConvocatoria });
        this.mostrarMensajeFlotante('success', 'Creada');
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
  }

  mostrarMensajeFlotante(tipo: 'success' | 'error' | 'loading', texto: string): void {
    this.tipoMensaje = tipo;
    this.textoMensaje = texto;
    this.mostrarMensajeCentral = true;
    if (tipo !== 'loading') setTimeout(() => { this.mostrarMensajeCentral = false; }, 3000);
  }

  abrirConfirmacion(titulo: string, mensaje: string, accion: () => void): void {
    this.tituloConfirmacion = titulo;
    this.mensajeConfirmacion = mensaje;
    this.accionConfirmacion = accion;
    this.mostrarConfirmacion = true;
  }

  confirmarAccion(): void {
    this.mostrarConfirmacion = false;
    if (this.accionConfirmacion) { this.accionConfirmacion(); this.accionConfirmacion = null; }
  }

  cancelarConfirmacion(): void {
    this.mostrarConfirmacion = false;
    this.accionConfirmacion = null;
  }

  getEstadoClass(e: string): string { return e === 'activa' ? 'estado-activa' : 'estado-cerrada'; }
  getEstadoTexto(e: string): string { return e === 'activa' ? 'Activa' : 'Cerrada'; }
  getTipoTexto(t: string): string { return t === 'paradeporte' ? 'Para Deporte' : 'Deporte'; }
  getTipoClass(t: string): string { return t === 'paradeporte' ? 'tipo-paradeporte' : 'tipo-deporte'; }

  obtenerDatosEjemplo(): Convocatoria[] {
    const conv: Convocatoria[] = [];
    let id = 1;
    const deportes = ['Rugby', 'Tenis de campo', 'Judo', 'Voleibol', 'Futbol', 'Baloncesto', 'Atletismo', 'Pickleball'];
    
    deportes.forEach(d => {
      conv.push({
        id_convocatoria: id++, titulo: d, subtitulo: 'Academia IPD - Temporada 2026',
        descripcion: `Inscripciones abiertas para ${d}. ¡Totalmente gratuito!`,
        urlimagen: 'https://i.imgur.com/srcVUcm.png', deporte: d, tipo: 'deporte', temporada: 'Temporada 2026',
        horarios: [{ id: id, dias: 'Lunes - Miércoles - Viernes', hora: '3 - 6 PM', sede: 'Estadio Nacional', disciplina: d, temporada: 'Academia IPD 2026', vacantes: 60, disponibles: 42, textoCompleto: 'Lun-Mié-Vie: 3-6 PM' }],
        numvacantes: 60, numdisponibles: 42, numinscritos: 18, estado: 'activa',
        region: 'Lima', sede: 'Estadio Nacional', fechacreada: new Date(), isFlipped: false
      });
    });

    conv.push({
      id_convocatoria: id++, titulo: 'Voleibol', subtitulo: 'Academia IPD - Múltiples Horarios',
      descripcion: 'Inscripciones con dos horarios disponibles.',
      urlimagen: 'https://i.imgur.com/srcVUcm.png', deporte: 'Voleibol', tipo: 'deporte', temporada: 'Temporada 2026',
      horarios: [
        { id: id * 10, dias: 'Martes - Jueves', hora: '3 - 6 PM', sede: 'Estadio Nacional', disciplina: 'Voleibol', temporada: 'Academia IPD 2026', vacantes: 30, disponibles: 15, textoCompleto: 'Mar-Jue: 3-6 PM' },
        { id: id * 10 + 1, dias: 'Sábado', hora: '9 AM - 12 PM', sede: 'Complejo Chacapampa', disciplina: 'Voleibol', temporada: 'Academia IPD 2026', vacantes: 25, disponibles: 18, textoCompleto: 'Sáb: 9-12 PM' }
      ],
      numvacantes: 55, numdisponibles: 33, numinscritos: 22, estado: 'activa',
      region: 'Lima', sede: 'Estadio Nacional', fechacreada: new Date(), isFlipped: false
    });

    [{ d: 'Atletismo', n: 'Para Atletismo' }, { d: 'Judo', n: 'Para Judo' }].forEach(pd => {
      conv.push({
        id_convocatoria: id++, titulo: pd.n, subtitulo: 'Academia IPD Para Deporte',
        descripcion: `Programa inclusivo de ${pd.n}.`,
        urlimagen: 'https://i.imgur.com/srcVUcm.png', deporte: pd.d, tipo: 'paradeporte', temporada: 'Temporada 2026',
        horarios: [{ id: id * 100, dias: 'Lunes - Miércoles - Viernes', hora: '3 - 6 PM', sede: 'Estadio Nacional', disciplina: pd.d, temporada: 'Academia IPD 2026', vacantes: 25, disponibles: 8, textoCompleto: 'Lun-Mié-Vie: 3-6 PM' }],
        numvacantes: 25, numdisponibles: 8, numinscritos: 17, estado: 'activa',
        region: 'Lima', sede: 'Estadio Nacional', fechacreada: new Date(), isFlipped: false
      });
    });

    conv.push({
      id_convocatoria: id++, titulo: 'Futbol', subtitulo: 'ACADEMIA IPD - Cusco',
      descripcion: 'Programa cerrado.',
      urlimagen: 'https://i.imgur.com/srcVUcm.png', deporte: 'Futbol', tipo: 'deporte', temporada: 'Temporada 2025',
      horarios: [{ id: id * 1000, dias: 'Martes - Jueves', hora: '3 - 6 PM', sede: 'Complejo Cusco', disciplina: 'Futbol', temporada: 'Academia IPD 2025', vacantes: 150, disponibles: 0, textoCompleto: 'Mar-Jue: 3-6 PM' }],
      numvacantes: 150, numdisponibles: 0, numinscritos: 150, estado: 'cerrada',
      region: 'Cusco', sede: 'Complejo Cusco', fechacreada: new Date(), isFlipped: false
    });

    return conv;
  }


  my= new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}