import { Component, OnInit } from '@angular/core';
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
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface Convocatoria {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  organizacion: string;
  region: string;
  sede: string;
  fechaInicio: string;
  fechaFin: string;
  horario: string;
  ubicacion: string;
  cuposDisponibles: number;
  cuposTotales: number;
  inscritos: number;
  estado: 'activa' | 'proximamente' | 'cerrada';
  requisitos: string[];
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './convocatoria.component.html',
  styleUrls: ['./convocatoria.component.css']
})
export class ConvocatoriaComponent implements OnInit {

  // Datos de convocatorias
  convocatorias: Convocatoria[] = [];
  convocatoriasFiltradas: Convocatoria[] = [];

  // Filtros
  busqueda: string = '';
  regionSeleccionada: string = '';
  sedeSeleccionada: string = '';
  estadoSeleccionado: string = '';
  fechaInicioFiltro: Date | null = null;
  fechaFinFiltro: Date | null = null;

  // Opciones para los filtros
  regiones: string[] = [];
  sedes: string[] = [];
  estados = [
    { value: 'activa', label: 'Activa' },
    { value: 'proximamente', label: 'Próximamente' },
    { value: 'cerrada', label: 'Cerrada' }
  ];

  // Estados de carga
  cargando: boolean = true;
  mostrarFiltros: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.cargarConvocatorias();
  }

  /**
   * Cargar convocatorias desde JSON local o API
   */
  cargarConvocatorias(): void {
    this.cargando = true;

    // Datos de ejemplo (simulando respuesta de API)
    // En producción, esto sería una llamada HTTP a tu API
    setTimeout(() => {
      this.convocatorias = this.obtenerDatosEjemplo();
      this.convocatoriasFiltradas = [...this.convocatorias];
      this.extraerOpcionesFiltros();
      this.cargando = false;
    }, 500);

    // TODO: Reemplazar con llamada real a la API
    // this.http.get<Convocatoria[]>('api/convocatorias').subscribe({
    //   next: (data) => {
    //     this.convocatorias = data;
    //     this.convocatoriasFiltradas = [...this.convocatorias];
    //     this.extraerOpcionesFiltros();
    //     this.cargando = false;
    //   },
    //   error: (error) => {
    //     console.error('Error al cargar convocatorias:', error);
    //     this.cargando = false;
    //   }
    // });
  }

  /**
   * Extraer opciones únicas para los filtros
   */
  extraerOpcionesFiltros(): void {
    this.regiones = [...new Set(this.convocatorias.map(c => c.region))].sort();
    this.sedes = [...new Set(this.convocatorias.map(c => c.sede))].sort();
  }

  /**
   * Aplicar todos los filtros
   */
  aplicarFiltros(): void {
    this.convocatoriasFiltradas = this.convocatorias.filter(conv => {
      // Filtro de búsqueda general
      const matchBusqueda = this.busqueda === '' ||
        conv.titulo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        conv.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        conv.organizacion.toLowerCase().includes(this.busqueda.toLowerCase());

      // Filtro de región
      const matchRegion = this.regionSeleccionada === '' ||
        conv.region === this.regionSeleccionada;

      // Filtro de sede
      const matchSede = this.sedeSeleccionada === '' ||
        conv.sede === this.sedeSeleccionada;

      // Filtro de estado
      const matchEstado = this.estadoSeleccionado === '' ||
        conv.estado === this.estadoSeleccionado;

      // Filtro de fecha inicio
      const matchFechaInicio = !this.fechaInicioFiltro ||
        new Date(conv.fechaInicio) >= this.fechaInicioFiltro;

      // Filtro de fecha fin
      const matchFechaFin = !this.fechaFinFiltro ||
        new Date(conv.fechaFin) <= this.fechaFinFiltro;

      return matchBusqueda && matchRegion && matchSede && matchEstado &&
        matchFechaInicio && matchFechaFin;
    });
  }

  /**
   * Limpiar todos los filtros
   */
  limpiarFiltros(): void {
    this.busqueda = '';
    this.regionSeleccionada = '';
    this.sedeSeleccionada = '';
    this.estadoSeleccionado = '';
    this.fechaInicioFiltro = null;
    this.fechaFinFiltro = null;
    this.aplicarFiltros();
  }

  /**
   * Toggle mostrar/ocultar filtros
   */
  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  /**
   * Ver detalles de una convocatoria
   */
  verDetalles(convocatoria: Convocatoria): void {
    console.log('Ver detalles de:', convocatoria);
    // TODO: Navegar a la página de detalles o abrir modal
    // this.router.navigate(['/admin/convocatoria', convocatoria.id]);
  }

  /**
   * Inscribirse a una convocatoria
   */
  inscribirse(convocatoria: Convocatoria): void {
    if (convocatoria.estado === 'activa' && convocatoria.cuposDisponibles > 0) {
      console.log('Inscribirse a:', convocatoria);
      // TODO: Navegar al formulario de inscripción
      // this.router.navigate(['/admin/pre-inscripcion'], { 
      //   queryParams: { convocatoriaId: convocatoria.id }
      // });
      alert(`Redirigiendo a inscripción para: ${convocatoria.titulo}`);
    }
  }

  /**
   * Compartir convocatoria
   */
  compartir(convocatoria: Convocatoria): void {
    // TODO: Implementar funcionalidad de compartir
    if (navigator.share) {
      navigator.share({
        title: convocatoria.titulo,
        text: convocatoria.descripcion,
        url: window.location.href
      });
    } else {
      // Fallback: copiar al portapapeles
      const url = `${window.location.origin}/convocatoria/${convocatoria.id}`;
      navigator.clipboard.writeText(url);
      alert('Enlace copiado al portapapeles');
    }
  }

  /**
   * Obtener clase CSS según el estado
   */
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'activa':
        return 'estado-activa';
      case 'proximamente':
        return 'estado-proximamente';
      case 'cerrada':
        return 'estado-cerrada';
      default:
        return '';
    }
  }

  /**
   * Obtener texto del estado
   */
  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'activa':
        return 'Activa';
      case 'proximamente':
        return 'Próximamente';
      case 'cerrada':
        return 'Cerrada';
      default:
        return estado;
    }
  }

  /**
   * Calcular porcentaje de cupos ocupados
   */
  getPorcentajeCupos(convocatoria: Convocatoria): number {
    return Math.round((convocatoria.inscritos / convocatoria.cuposTotales) * 100);
  }

  /**
   * Datos de ejemplo para pruebas
   * TODO: Eliminar cuando se conecte con la API real
   */
  obtenerDatosEjemplo(): Convocatoria[] {
    return [
      {
        id: 1,
        titulo: 'Fútbol y Atletismo IPD - ¡Inscripciones Abiertas!',
        descripcion: 'Inscripciones abiertas para fútbol y atletismo en el Estadio Municipal de Castrovirreyna. ¡Totalmente gratuito!',
        imagen: 'https://i.imgur.com/JELgLb5.png',
        organizacion: 'Academia IPD',
        region: 'Lima',
        sede: 'Estadio Municipal Castrovirreyna',
        fechaInicio: '2025-03-01',
        fechaFin: '2025-03-26',
        horario: 'Lunes a Viernes de 3:00 PM a 6:00 PM',
        ubicacion: 'Castrovirreyna, Huancavelica',
        cuposDisponibles: 39,
        cuposTotales: 50,
        inscritos: 11,
        estado: 'activa',
        requisitos: ['Tener entre 8 y 17 años',
          'DNI del alumno y apoderado',
          'Certificado médico',
          'Autorización del padre/madre/tutor']
      },
      {
        id: 2,
        titulo: 'Vóley IPD - Cupos Disponibles en Chacapampa',
        descripcion: 'Inscripciones abiertas para vóley en el Complejo Deportivo Chacapampa. Formación integral y gratuita.',
        imagen: 'https://i.imgur.com/Vep18ZR.png',
        organizacion: 'ACADEMIA IPD',
        region: 'Lima',
        sede: 'Complejo Deportivo Chacapampa',
        fechaInicio: '2025-03-01',
        fechaFin: '2025-03-26',
        horario: 'Martes y Jueves de 4:00 PM a 7:00 PM',
        ubicacion: 'Lima',
        cuposDisponibles: 42,
        cuposTotales: 60,
        inscritos: 18,
        estado: 'activa',
        requisitos: ['Tener entre 10 y 16 años',
          'DNI del alumno y apoderado',
          'Certificado médico',
          'Autorización del padre/madre/tutor']
      },
      {
        id: 3,
        titulo: 'Fútbol, Básquet y Natación IPD',
        descripcion: 'Programas deportivos de fútbol, básquet y natación en el Complejo Deportivo Villa El Salvador.',
        imagen: 'https://i.imgur.com/PbqmuHy.png',
        organizacion: 'ACADEMIA IPD',
        region: 'Lima',
        sede: 'Complejo Deportivo Villa El Salvador',
        fechaInicio: '2025-03-10',
        fechaFin: '2025-04-05',
        horario: 'Lunes a Viernes de 2:00 PM a 6:00 PM',
        ubicacion: 'Villa El Salvador, Lima',
        cuposDisponibles: 145,
        cuposTotales: 200,
        inscritos: 55,
        estado: 'activa',
        requisitos: [
          'Tener entre 7 y 18 años',
          'DNI del alumno y apoderado',
          'Certificado médico (para natación adicional prueba de aptitud)',
          'Autorización del padre/madre/tutor'
        ]
      },
      {
        id: 4,
        titulo: 'Atletismo IPD - Desarrollo de Talentos',
        descripcion: 'Desarrollo de talentos en atletismo con entrenadores especializados. Categorías menores y juveniles.',
        imagen: 'https://i.imgur.com/nfU4p6S.png',
        organizacion: 'ACADEMIA IPD',
        region: 'Lima',
        sede: 'Complejo Deportivo San Luis',
        fechaInicio: '2025-03-15',
        fechaFin: '2025-04-10',
        horario: 'Lunes, Miércoles y Viernes de 3:30 PM a 6:30 PM',
        ubicacion: 'San Luis, Lima',
        cuposDisponibles: 28,
        cuposTotales: 50,
        inscritos: 22,
        estado: 'activa',
        requisitos: [
          'Tener entre 8 y 16 años',
          'DNI del alumno y apoderado',
          'Certificado médico con evaluación cardiológica',
          'Autorización del padre/madre/tutor',
          'Zapatillas deportivas adecuadas'
        ]
      },
      {
        id: 5,
        titulo: 'Fútbol IPD Callao - Próximamente',
        descripcion: 'Escuela de fútbol para niños y adolescentes en el Complejo Deportivo Miguel Grau del Callao.',
        imagen: 'https://i.imgur.com/NyPGE4B.png',
        organizacion: 'ACADEMIA IPD',
        region: 'Callao',
        sede: 'Complejo Deportivo Miguel Grau',
        fechaInicio: '2025-04-01',
        fechaFin: '2025-04-25',
        horario: 'Martes a Sábado de 4:00 PM a 7:00 PM',
        ubicacion: 'Callao',
        cuposDisponibles: 60,
        cuposTotales: 80,
        inscritos: 20,
        estado: 'proximamente',
        requisitos: [
          'Tener entre 6 y 17 años',
          'DNI del alumno y apoderado',
          'Certificado médico',
          'Autorización del padre/madre/tutor'
        ]
      },
      {
        id: 6,
        titulo: 'Cusco Multideporte 2024 II (Cerrada)',
        descripcion: 'Programa multideportivo de la temporada 2024 II. Inscripciones cerradas, próxima convocatoria en marzo 2025.',
        imagen: 'https://i.imgur.com/bYRBpjX.png',
        organizacion: 'ACADEMIA IPD',
        region: 'Cusco',
        sede: 'Complejo Deportivo Cusco',
        fechaInicio: '2024-09-01',
        fechaFin: '2024-09-30',
        horario: 'Lunes a Viernes de 3:00 PM a 6:00 PM',
        ubicacion: 'Cusco',
        cuposDisponibles: 0,
        cuposTotales: 150,
        inscritos: 150,
        estado: 'cerrada',
        requisitos: [
          'Tener entre 7 y 18 años',
          'DNI del alumno y apoderado',
          'Certificado médico',
          'Autorización del padre/madre/tutor'
        ]
      }
    ];
  }
}