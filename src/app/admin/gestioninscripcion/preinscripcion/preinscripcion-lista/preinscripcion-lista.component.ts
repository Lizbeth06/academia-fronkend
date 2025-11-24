import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Angular Material Modules
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';

// Formato de fecha personalizado
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

// Interface para participante
export interface Participante {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  fechaNacimiento: Date;
  sexo: string;
  parentesco: string;
  tipoSeguro: string;
  tieneDiscapacidad: boolean;
  modalidadEnvio: 'digital' | 'presencial' | null;
  archivosDigitales?: {
    dniMenor: File | null;
    dniApoderado: File | null;
    conadis: File | null;
    seguroMedico: File | null;
    declaracionJurada: File | null;
  };
  horarioAsignado?: HorarioAsignado | null;
}

// Interface para horario asignado
export interface HorarioAsignado {
  participanteId: number;
  participanteNombre: string;
  departamento: string;
  provincia: string;
  distrito: string;
  complejoDeportivo: string;
  complejoDeportivoNombre: string;
  deporte: string;
  deporteNombre: string;
  horario: any;
}

// Interface para modal informativo
export interface ModalInformativo {
  participante: Participante;
  modalidad: 'digital' | 'presencial';
  codigoRegistro: string;
}

@Component({
  selector: 'app-pre-inscripcion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatDialogModule,
    MatExpansionModule
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' }
  ],
  templateUrl: './preinscripcion-lista.component.html',
  styleUrl: './preinscripcion-lista.component.css'
})
export class PreInscripcionComponent implements OnInit {
  
  // Formularios para cada paso
  apoderadoForm!: FormGroup;
  alumnoForm!: FormGroup; 
  sedeDeporteForm!: FormGroup;
  documentosForm!: FormGroup;

  //  Participantes
  participantes: Participante[] = [];
  participanteActualIndex: number = 0;
  editandoParticipante: boolean = false;

  //  NUEVO: Horarios asignados
  horariosAsignados: HorarioAsignado[] = [];
  participanteSeleccionadoId: number | null = null;
  editandoHorario: boolean = false;
  horarioActualIndex: number = 0;

  //  NUEVO: Modalidad envío
  modalidadEnvioActual: 'digital' | 'presencial' | null = null;
  
  //  NUEVO: Archivos digitales temporales (mientras edita formulario)
  archivosDigitalesTemp: {
    dniMenor: File | null;
    dniApoderado: File | null;
    conadis: File | null;
    seguroMedico: File | null;
    declaracionJurada: File | null;
  } = {
    dniMenor: null,
    dniApoderado: null,
    conadis: null,
    seguroMedico: null,
    declaracionJurada: null
  };
  
  //  NUEVO: Modales informativos
  modalesInformativos: ModalInformativo[] = [];
  modalInformativoActual: ModalInformativo | null = null;
  indiceModalActual: number = 0;

  // NUEVO: Carousel de fichas
  fichaActual: number = 0;

  // NUEVO: Tipo de Apoderado
  tiposApoderado = [
    { value: 'papa', label: 'Papá' },
    { value: 'mama', label: 'Mamá' },
    { value: 'tio', label: 'Tío(a)' },
    { value: 'otros', label: 'Otros' }
  ];

  // Opciones para los dropdowns
  tiposDocumento = [
    { value: '30', label: 'DNI' },
    { value: '31', label: 'Carnet de extranjería' }
  ];

  sexos = [
    { value: '1', label: 'Masculino' },
    { value: '2', label: 'Femenino' }
  ];

  parentescos = [
    { value: '1', label: 'Hijo(a)' },
    { value: '2', label: 'Sobrino(a)' },
    { value: '3', label: 'Nieto(a)' },
    { value: '4', label: 'Otro' }
  ];

  tiposSeguro = [
    { value: '1', label: 'SIS' },
    { value: '2', label: 'EsSalud' },
    { value: '3', label: 'Privado' },
    { value: '4', label: 'Otros' }
  ];

  // Datos para ubicación
  departamentos: any[] = [];
  provincias: any[] = [];
  distritos: any[] = [];
  
  // Datos para sede/deporte
  departamentosSede: any[] = [];
  provinciasSede: any[] = [];
  distritosSede: any[] = [];
  complejosDeportivos: any[] = [];
  deportes: any[] = [];
  horarios: any[] = [];

  // Estados de carga
  cargandoApoderado = false;
  cargandoAlumno = false;
  tieneDiscapacidad = false;
  horarioSeleccionado: any = null;

  // Modal informativo
  mostrarModalInformativo = false;

  datosInformativos?: any[];

  // Datos de confirmación
  codigoRegistro = '';
  datosInscripcion: any = null;
  
  // Archivos subidos (legacy - ahora por participante)
  archivosSubidos: any = {
    dniMenor: null,
    dniApoderado: null,
    conadis: null,
    seguroMedico: null,
    fichaPreinscripcion: null,
    declaracionJurada: null
  };

  // Mapa
  mapaVisible = false;
  ubicacionComplejo: any = null;

  // Mostrar paso de documentos
  mostrarPasoDocumentos = false;
  mostrarConfirmacion = false;

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.inicializarFormularios();
    this.cargarDatosIniciales();
  }

  inicializarFormularios(): void {
    // PASO 1: Datos del Apoderado + Dirección ( NUEVO: tipoApoderado)
    this.apoderadoForm = this.fb.group({
      tipoApoderado: ['', Validators.required],
      tipoDocumento: ['30', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      nombres: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      direccion: ['', Validators.required],
      referencia: ['']
    });

    // PASO 2: Datos del Alumno ( NUEVO: modalidadEnvio)
    this.alumnoForm = this.fb.group({
      tipoDocumento: ['30', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      nombres: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      parentesco: ['', Validators.required],
      tipoSeguro: ['', Validators.required],
      tieneDiscapacidad: [false],
      modalidadEnvio: [null, Validators.required]
    });

    // PASO 3: Complejo Deportivo + Deporte + Horarios
    this.sedeDeporteForm = this.fb.group({
      participante: ['', Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      complejoDeportivo: ['', Validators.required],
      deporte: ['', Validators.required]
    });

    // PASO 5: Documentos
    this.documentosForm = this.fb.group({
      dniMenor: [null],
      dniApoderado: [null],
      conadis: [null],
      seguroMedico: [null],
      fichaPreinscripcion: [null],
      declaracionJurada: [null]
    });
  }

  cargarDatosIniciales(): void {
    // Datos para dirección del apoderado
    this.departamentos = [
      { value: '15', label: 'LIMA' },
      { value: '01', label: 'AMAZONAS' },
      { value: '02', label: 'ANCASH' },
      { value: '03', label: 'APURÍMAC' },
      { value: '04', label: 'AREQUIPA' }
    ];

    // Datos para sede deportiva
    this.departamentosSede = [
      { value: '15', label: 'LIMA' },
      { value: '04', label: 'AREQUIPA' }
    ];
  }

  // ==================== PASO 1: APODERADO ====================
  
  buscarApoderado(): void {
    const dni = this.apoderadoForm.get('numeroDocumento')?.value;
    
    if (dni && dni.length === 8) {
      this.cargandoApoderado = true;
      
      setTimeout(() => {
        this.apoderadoForm.patchValue({
          apellidoPaterno: 'ARIAS',
          apellidoMaterno: 'CAMPOS',
          nombres: 'LUIS ALFONSO',
          fechaNacimiento: new Date('1985-03-15')
        });
        this.cargandoApoderado = false;
      }, 1000);
    }
  }

  onDepartamentoChange(): void {
    const depId = this.apoderadoForm.get('departamento')?.value;
    this.provincias = [];
    this.distritos = [];
    this.apoderadoForm.patchValue({ provincia: '', distrito: '' });

    if (depId === '15') {
      this.provincias = [
        { value: '1501', label: 'LIMA' },
        { value: '1502', label: 'BARRANCA' }
      ];
    } else if (depId === '04') {
      this.provincias = [
        { value: '0401', label: 'AREQUIPA' }
      ];
    }
  }

  onProvinciaChange(): void {
    const provId = this.apoderadoForm.get('provincia')?.value;
    this.distritos = [];
    this.apoderadoForm.patchValue({ distrito: '' });

    if (provId === '1501') {
      this.distritos = [
        { value: '150101', label: 'LIMA' },
        { value: '150103', label: 'ATE' },
        { value: '150106', label: 'CHORRILLOS' },
        { value: '150114', label: 'LA MOLINA' },
        { value: '150117', label: 'LINCE' }
      ];
    } else if (provId === '0401') {
      this.distritos = [
        { value: '040101', label: 'AREQUIPA' }
      ];
    }
  }

  // ==================== PASO 2: PARTICIPANTES (MÚLTIPLES) ====================
  
  buscarAlumno(): void {
    const dni = this.alumnoForm.get('numeroDocumento')?.value;
    
    if (dni && dni.length === 8) {
      this.cargandoAlumno = true;
      
      setTimeout(() => {
        this.alumnoForm.patchValue({
          apellidoPaterno: 'GARCÍA',
          apellidoMaterno: 'LÓPEZ',
          nombres: 'MARÍA FERNANDA',
          fechaNacimiento: new Date('2010-05-20')
        });
        this.cargandoAlumno = false;
      }, 1000);
    }
  }

  //  NUEVO: Verificar si formulario básico está completo (sin modalidad)
  formularioBasicoCompleto(): boolean {
    const form = this.alumnoForm;
    return !!(
      form.get('tipoDocumento')?.value &&
      form.get('numeroDocumento')?.valid &&
      form.get('apellidoPaterno')?.value &&
      form.get('apellidoMaterno')?.value &&
      form.get('nombres')?.value &&
      form.get('fechaNacimiento')?.value &&
      form.get('sexo')?.value &&
      form.get('parentesco')?.value &&
      form.get('tipoSeguro')?.value &&
      form.get('tieneDiscapacidad')?.value !== null
    );
  }

  onDiscapacidadChange(event: any): void {
    this.tieneDiscapacidad = event.checked;
  }

  //  NUEVO: Manejar cambio de modalidad de envío (puede cambiar libremente)
  onModalidadEnvioChange(modalidad: 'digital' | 'presencial'): void {
    // Si clickea la misma opción, la desmarca
    if (this.modalidadEnvioActual === modalidad) {
      this.modalidadEnvioActual = null;
      this.alumnoForm.patchValue({ modalidadEnvio: null });
    } else {
      // Cambia a la nueva opción
      this.modalidadEnvioActual = modalidad;
      this.alumnoForm.patchValue({ modalidadEnvio: modalidad });
    }
  }

  // Agregar participante al array
  agregarParticipante(): void {
    if (this.alumnoForm.valid) {
      const nuevoParticipante: Participante = {
        id: this.participantes.length + 1,
        ...this.alumnoForm.value,
        archivosDigitales: this.alumnoForm.value.modalidadEnvio === 'digital' ? {
          dniMenor: this.archivosDigitalesTemp.dniMenor,
          dniApoderado: this.archivosDigitalesTemp.dniApoderado,
          conadis: this.archivosDigitalesTemp.conadis,
          seguroMedico: this.archivosDigitalesTemp.seguroMedico,
          declaracionJurada: this.archivosDigitalesTemp.declaracionJurada
        } : undefined,
        horarioAsignado: null
      };

      this.participantes.push(nuevoParticipante);
      this.limpiarFormularioAlumno();
      
      setTimeout(() => {
        const elemento = document.querySelector('.participantes-agregados');
        elemento?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      alert('Por favor complete todos los campos obligatorios del participante');
    }
  }

  limpiarFormularioAlumno(): void {
    this.alumnoForm.reset({
      tipoDocumento: '30',
      tieneDiscapacidad: false,
      modalidadEnvio: null
    });
    this.tieneDiscapacidad = false;
    this.modalidadEnvioActual = null;
    
    //  Limpiar archivos temporales
    this.archivosDigitalesTemp = {
      dniMenor: null,
      dniApoderado: null,
      conadis: null,
      seguroMedico: null,
      declaracionJurada: null
    };
  }

  editarParticipante(participante: Participante): void {
    this.editandoParticipante = true;
    this.participanteActualIndex = this.participantes.findIndex(p => p.id === participante.id);
    
    this.alumnoForm.patchValue({
      tipoDocumento: participante.tipoDocumento,
      numeroDocumento: participante.numeroDocumento,
      apellidoPaterno: participante.apellidoPaterno,
      apellidoMaterno: participante.apellidoMaterno,
      nombres: participante.nombres,
      fechaNacimiento: participante.fechaNacimiento,
      sexo: participante.sexo,
      parentesco: participante.parentesco,
      tipoSeguro: participante.tipoSeguro,
      tieneDiscapacidad: participante.tieneDiscapacidad,
      modalidadEnvio: participante.modalidadEnvio
    });
    
    this.tieneDiscapacidad = participante.tieneDiscapacidad;
    this.modalidadEnvioActual = participante.modalidadEnvio;

    setTimeout(() => {
      const elemento = document.querySelector('.form-card');
      elemento?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  actualizarParticipante(): void {
    if (this.alumnoForm.valid && this.editandoParticipante) {
      this.participantes[this.participanteActualIndex] = {
        ...this.participantes[this.participanteActualIndex],
        ...this.alumnoForm.value,
        id: this.participantes[this.participanteActualIndex].id
      };
      
      this.editandoParticipante = false;
      this.limpiarFormularioAlumno();
    }
  }

  cancelarEdicion(): void {
    this.editandoParticipante = false;
    this.limpiarFormularioAlumno();
  }

  eliminarParticipante(participante: Participante): void {
    if (confirm(`¿Está seguro de eliminar al participante ${participante.nombres} ${participante.apellidoPaterno}?`)) {
      this.participantes = this.participantes.filter(p => p.id !== participante.id);
      // También eliminar horarios asignados
      this.horariosAsignados = this.horariosAsignados.filter(h => h.participanteId !== participante.id);
    }
  }

  puedeAvanzarPaso2(): boolean {
    return this.participantes.length > 0 && !this.editandoParticipante;
  }

  getLabelFromValue(array: any[], value: string): string {
    const item = array.find(i => i.value === value);
    return item ? item.label : value;
  }

  //  NUEVO: Subir archivos digitales temporales (formulario actual)
  onFileSelectTemp(event: any, tipo: 'dniMenor' | 'dniApoderado' | 'conadis' | 'seguroMedico' | 'declaracionJurada'): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Solo se permiten archivos PDF, JPG o PNG');
        event.target.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo no debe superar los 5MB');
        event.target.value = '';
        return;
      }

      // Guardar archivo en archivosDigitalesTemp
      this.archivosDigitalesTemp[tipo] = file;
    }
  }

  //  NUEVO: Obtener nombre de archivo temporal
  getNombreArchivoTemp(tipo: 'dniMenor' | 'dniApoderado' | 'conadis' | 'seguroMedico' | 'declaracionJurada'): string {
    if (this.archivosDigitalesTemp[tipo]) {
      return this.archivosDigitalesTemp[tipo]!.name;
    }
    return 'Ningún archivo';
  }

  //  NUEVO: Subir archivos digitales por participante
  onFileSelectParticipante(event: any, participante: Participante, tipo: string): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Solo se permiten archivos PDF, JPG o PNG');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo no debe superar los 5MB');
        return;
      }

      if (participante.archivosDigitales) {
        (participante.archivosDigitales as any)[tipo] = file;
      }
    }
  }

  getNombreArchivoParticipante(participante: Participante, tipo: string): string {
    if (participante.archivosDigitales && (participante.archivosDigitales as any)[tipo]) {
      return (participante.archivosDigitales as any)[tipo].name;
    }
    return 'Ningún archivo seleccionado';
  }

  //  NUEVO: Validar archivos digitales del formulario actual
  formularioTieneArchivosDigitalesCompletos(): boolean {
    // Si no es digital, no necesita archivos
    if (this.modalidadEnvioActual !== 'digital') {
      return true;
    }

    const archivos = this.archivosDigitalesTemp;
    const tieneDiscapacidad = this.alumnoForm.get('tieneDiscapacidad')?.value;

    // Validar archivos obligatorios
    const tieneObligatorios = !!(
      archivos.dniMenor &&
      archivos.dniApoderado &&
      archivos.seguroMedico &&
      archivos.declaracionJurada
    );

    // Si tiene discapacidad, también necesita CONADIS
    if (tieneDiscapacidad) {
      return tieneObligatorios && !!archivos.conadis;
    }

    return tieneObligatorios;
  }

  //  NUEVO: Validar que tiene archivos digitales completos
  tieneArchivosDigitalesCompletos(participante: Participante): boolean {
    if (participante.modalidadEnvio !== 'digital' || !participante.archivosDigitales) {
      return false;
    }

    const archivos = participante.archivosDigitales;
    const obligatorios = ['dniMenor', 'dniApoderado', 'seguroMedico', 'declaracionJurada'];
    
    for (const tipo of obligatorios) {
      if (!(archivos as any)[tipo]) {
        return false;
      }
    }

    if (participante.tieneDiscapacidad && !archivos.conadis) {
      return false;
    }

    return true;
  }

  // NUEVO: Habilitar descarga de Declaración Jurada
  puedeDescargarDeclaracionJurada(participante: Participante): boolean {
    return participante.modalidadEnvio === 'digital' && 
           !!participante.nombres && 
           !!participante.numeroDocumento;
  }

  //  NUEVO: Generar Declaración Jurada desde formulario (antes de agregar)
  generarDeclaracionJuradaFormulario(): void {
    const datosFormulario = this.alumnoForm.value;
    console.log('Generando Declaración Jurada para formulario:', datosFormulario);
    alert('Generando Declaración Jurada. En producción se generará el PDF con los datos del apoderado y participante.');
    // TODO: Implementar generación de PDF con datos del apoderado y participante del formulario
  }

  // NUEVO: Generar Declaración Jurada
  generarDeclaracionJurada(participante: Participante): void {
    console.log('Generando Declaración Jurada para:', participante);
    // TODO: Implementar generación de PDF con datos del apoderado y participante
    alert(`Generando Declaración Jurada para ${participante.nombres} ${participante.apellidoPaterno}...`);
  }

  // Continúa en siguiente parte...

  // ==================== PASO 3: HORARIOS POR PARTICIPANTE ====================
  
  onParticipanteChange(): void {
    const participanteId = this.sedeDeporteForm.get('participante')?.value;
    this.participanteSeleccionadoId = participanteId;
    // Limpiar selecciones
    this.sedeDeporteForm.patchValue({
      departamento: '',
      provincia: '',
      distrito: '',
      complejoDeportivo: '',
      deporte: ''
    });
    this.deportes = [];
    this.horarios = [];
    this.horarioSeleccionado = null;
  }

  onDepartamentoSedeChange(): void {
    const depId = this.sedeDeporteForm.get('departamento')?.value;
    this.provinciasSede = [];
    this.distritosSede = [];
    this.complejosDeportivos = [];
    this.deportes = [];
    this.horarios = [];
    this.sedeDeporteForm.patchValue({ provincia: '', distrito: '', complejoDeportivo: '', deporte: '' });

    if (depId === '15') {
      this.provinciasSede = [
        { value: '1501', label: 'LIMA' }
      ];
    } else if (depId === '04') {
      this.provinciasSede = [
        { value: '0401', label: 'AREQUIPA' }
      ];
    }
  }

  onProvinciaSedeChange(): void {
    const provId = this.sedeDeporteForm.get('provincia')?.value;
    this.distritosSede = [];
    this.complejosDeportivos = [];
    this.deportes = [];
    this.horarios = [];
    this.sedeDeporteForm.patchValue({ distrito: '', complejoDeportivo: '', deporte: '' });

    if (provId === '1501') {
      this.distritosSede = [
        { value: '150101', label: 'LIMA' },
        { value: '150130', label: 'SAN LUIS' },
        { value: '150132', label: 'SAN MARTÍN DE PORRES' }
      ];
    } else if (provId === '0401') {
      this.distritosSede = [
        { value: '040101', label: 'AREQUIPA' }
      ];
    }
  }

  onDistritoSedeChange(): void {
    const distId = this.sedeDeporteForm.get('distrito')?.value;
    this.complejosDeportivos = [];
    this.deportes = [];
    this.horarios = [];
    this.sedeDeporteForm.patchValue({ complejoDeportivo: '', deporte: '' });

    if (distId === '150101') {
      this.complejosDeportivos = [
        { value: '1', label: 'Estadio Nacional', lat: -12.0682, lng: -77.0321 }
      ];
    } else if (distId === '150130') {
      this.complejosDeportivos = [
        { value: '2', label: 'Polideportivo San Luis', lat: -12.0730, lng: -77.0055 }
      ];
    }
  }

  onComplejoDeportivoChange(): void {
    const complejoId = this.sedeDeporteForm.get('complejoDeportivo')?.value;
    this.deportes = [];
    this.horarios = [];
    this.horarioSeleccionado = null;
    
    this.sedeDeporteForm.patchValue({ deporte: '' });
    
    const complejo = this.complejosDeportivos.find(c => c.value === complejoId);
    if (complejo) {
      this.mapaVisible = true;
      this.ubicacionComplejo = {
        lat: complejo.lat,
        lng: complejo.lng,
        nombre: complejo.label
      };
    }

    if (complejoId === '1') {
      this.deportes = [
        { value: '1', label: 'Fútbol' },
        { value: '2', label: 'Básquet' },
        { value: '3', label: 'Natación' },
        { value: '4', label: 'Voleibol' },
        { value: '5', label: 'Atletismo' }
      ];
    } else if (complejoId === '2') {
      this.deportes = [
        { value: '4', label: 'Voleibol' },
        { value: '5', label: 'Atletismo' }
      ];
    }
  }

  onDeporteChange(): void {
    const deporteId = this.sedeDeporteForm.get('deporte')?.value;
    this.horarios = [];
    this.horarioSeleccionado = null;
    
    if (deporteId === '1') {
      this.horarios = [
        { 
          id: '1',
          edad: '8-12 años', 
          etapa: 'Masificación', 
          dias: 'Lun, Mié, Vie', 
          horas: '15:00 - 17:00'
        },
        { 
          id: '2',
          edad: '13-17 años', 
          etapa: 'Iniciación', 
          dias: 'Mar, Jue, Sáb', 
          horas: '08:00 - 10:00'
        }
      ];
    } else if (deporteId === '4') {
      this.horarios = [
        { 
          id: '3',
          edad: '10-16 años', 
          etapa: 'Masificación', 
          dias: 'Sáb', 
          horas: '12:00 - 12:45'
        },
        { 
          id: '4',
          edad: '10-16 años', 
          etapa: 'Masificación', 
          dias: 'Mié, Vie', 
          horas: '17:00 - 18:00'
        }
      ];
    } else {
      this.horarios = [
        { 
          id: '5',
          edad: '8-16 años', 
          etapa: 'Iniciación', 
          dias: 'Lun, Mié, Vie', 
          horas: '15:30 - 18:30'
        }
      ];
    }
  }

  seleccionarHorario(horario: any, event: any): void {
    if (event.checked) {
      this.horarioSeleccionado = horario;
    } else {
      if (this.horarioSeleccionado?.id === horario.id) {
        this.horarioSeleccionado = null;
      }
    }
  }

  esHorarioSeleccionado(horario: any): boolean {
    return this.horarioSeleccionado?.id === horario.id;
  }

  tieneHorarioSeleccionado(): boolean {
    return this.horarioSeleccionado !== null;
  }

  //  NUEVO: Agregar horario a participante
  agregarHorario(): void {
    if (!this.sedeDeporteForm.valid || !this.horarioSeleccionado) {
      alert('Por favor complete todos los campos y seleccione un horario');
      return;
    }

    const participanteId = this.sedeDeporteForm.value.participante;
    const participante = this.participantes.find(p => p.id === participanteId);

    if (!participante) {
      alert('Participante no encontrado');
      return;
    }

    // Verificar si ya tiene horario asignado
    const yaExiste = this.horariosAsignados.find(h => h.participanteId === participanteId);
    if (yaExiste) {
      alert('Este participante ya tiene un horario asignado. Puede editarlo o eliminarlo.');
      return;
    }

    const nuevoHorario: HorarioAsignado = {
      participanteId: participante.id,
      participanteNombre: `${participante.nombres} ${participante.apellidoPaterno} ${participante.apellidoMaterno}`,
      departamento: this.sedeDeporteForm.value.departamento,
      provincia: this.sedeDeporteForm.value.provincia,
      distrito: this.sedeDeporteForm.value.distrito,
      complejoDeportivo: this.sedeDeporteForm.value.complejoDeportivo,
      complejoDeportivoNombre: this.complejosDeportivos.find(c => c.value === this.sedeDeporteForm.value.complejoDeportivo)?.label || '',
      deporte: this.sedeDeporteForm.value.deporte,
      deporteNombre: this.deportes.find(d => d.value === this.sedeDeporteForm.value.deporte)?.label || '',
      horario: { ...this.horarioSeleccionado }
    };

    this.horariosAsignados.push(nuevoHorario);
    
    // Asignar al participante
    participante.horarioAsignado = nuevoHorario;
    
    // Limpiar formulario
    this.limpiarFormularioHorario();
    
    setTimeout(() => {
      const elemento = document.querySelector('.horarios-agregados');
      elemento?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  limpiarFormularioHorario(): void {
    // Limpiar TODOS los campos incluyendo el selector de participante
    this.sedeDeporteForm.reset();
    this.sedeDeporteForm.patchValue({
      participante: '',
      departamento: '',
      provincia: '',
      distrito: '',
      complejoDeportivo: '',
      deporte: ''
    });
    this.participanteSeleccionadoId = null;
    this.deportes = [];
    this.horarios = [];
    this.horarioSeleccionado = null;
    this.mapaVisible = false;
    this.provinciasSede = [];
    this.distritosSede = [];
    this.complejosDeportivos = [];
  }

  //  NUEVO: Editar horario
  editarHorario(horario: HorarioAsignado): void {
    // TODO: Implementar edición de horario
    alert('Función de editar horario en desarrollo');
  }

  //  NUEVO: Eliminar horario
  eliminarHorario(horario: HorarioAsignado): void {
    if (confirm(`¿Está seguro de eliminar el horario de ${horario.participanteNombre}?`)) {
      this.horariosAsignados = this.horariosAsignados.filter(h => h.participanteId !== horario.participanteId);
      
      // Quitar del participante
      const participante = this.participantes.find(p => p.id === horario.participanteId);
      if (participante) {
        participante.horarioAsignado = null;
      }
    }
  }

  //  NUEVO: Validar que hay horarios asignados
  puedeFinalizarInscripcion(): boolean {
    // Debe haber al menos un participante
    if (this.participantes.length === 0) {
      return false;
    }

    // TODOS los participantes deben tener un horario asignado
    return this.participantes.every(participante => {
      return this.horariosAsignados.some(horario => horario.participanteId === participante.id);
    });
  }

  getMapaUrl(): SafeResourceUrl {
    if (!this.ubicacionComplejo) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    const url = `https://www.google.com/maps?q=${this.ubicacionComplejo.lat},${this.ubicacionComplejo.lng}&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // ==================== FINALIZAR Y MODALES ====================
  
  finalizarPreInscripcion(): void {
    if (this.horariosAsignados.length === 0) {
      alert('Debe asignar al menos un horario a un participante');
      return;
    }

    // Validar que TODOS los participantes tengan horario
    if (!this.puedeFinalizarInscripcion()) {
      alert('Todos los participantes deben tener un horario asignado antes de finalizar');
      return;
    }

    // Generar códigos de registro y modales para cada participante
    this.modalesInformativos = [];
    
    this.participantes.forEach(participante => {
      const horario = this.horariosAsignados.find(h => h.participanteId === participante.id);
      if (horario) {
        const codigoRegistro = this.generarCodigoRegistro();
        
        this.modalesInformativos.push({
          participante: participante,
          modalidad: participante.modalidadEnvio || 'presencial',
          codigoRegistro: codigoRegistro
        });
      }
    });

    console.log('Modales a mostrar:', this.modalesInformativos.length);

    // Primero mostrar la confirmación
    this.mostrarConfirmacion = true;
    
    // Luego mostrar el primer modal después de un pequeño delay
    setTimeout(() => {
      this.indiceModalActual = 0;
      this.mostrarSiguienteModal();
    }, 500);
  }

  mostrarSiguienteModal(): void {
    console.log('Mostrando modal índice:', this.indiceModalActual, 'de', this.modalesInformativos.length);
    
    if (this.indiceModalActual < this.modalesInformativos.length) {
      this.modalInformativoActual = this.modalesInformativos[this.indiceModalActual];
      this.mostrarModalInformativo = true;
      console.log('Modal mostrado para:', this.modalInformativoActual.participante.nombres);
    } else {
      // Ya no hay más modales, simplemente cerrar
      this.mostrarModalInformativo = false;
      console.log('Ya no hay más modales');
    }
  }

  cerrarModalInformativo(): void {
    console.log('Cerrando modal índice:', this.indiceModalActual);
    this.mostrarModalInformativo = false;
    this.indiceModalActual++;
    setTimeout(() => {
      this.mostrarSiguienteModal();
    }, 300);
  }

  //  NUEVO: Carousel de fichas
  siguienteFicha(): void {
    if (this.fichaActual < this.participantes.length - 1) {
      this.fichaActual++;
    }
  }

  anteriorFicha(): void {
    if (this.fichaActual > 0) {
      this.fichaActual--;
    }
  }

  //  NUEVO: Generar Ficha de Pre-inscripción
  generarFichaPreinscripcion(participante: Participante): void {
    console.log('Generando Ficha de Pre-inscripción para:', participante);
    // TODO: Implementar generación de PDF
    alert(`Generando Ficha de Pre-inscripción para ${participante.nombres} ${participante.apellidoPaterno}...`);
  }

  calcularEdad(fechaNacimiento: Date): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }

  generarCodigoRegistro(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  //  NUEVO: Formatear fecha a DD/MM/YYYY
  formatearFecha(fecha: Date): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  // ==================== DOCUMENTOS (LEGACY) ====================
  
  onFileSelect(event: any, tipo: string): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Solo se permiten archivos PDF, JPG o PNG');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo no debe superar los 5MB');
        return;
      }

      this.archivosSubidos[tipo] = file;
    }
  }

  getNombreArchivo(tipo: string): string {
    return this.archivosSubidos[tipo]?.name || 'Ningún archivo seleccionado';
  }

  // ==================== UTILIDADES ====================

  soloLetras(event: KeyboardEvent): boolean {
    const char = String.fromCharCode(event.keyCode);
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(char);
  }

  soloNumeros(event: KeyboardEvent): boolean {
    const char = String.fromCharCode(event.keyCode);
    return /^[0-9]+$/.test(char);
  }

  resetFormularios(): void {
    this.apoderadoForm.reset({ tipoDocumento: '30', tipoApoderado: '' });
    this.alumnoForm.reset({ tipoDocumento: '30', tieneDiscapacidad: false, modalidadEnvio: null });
    this.sedeDeporteForm.reset();
    this.documentosForm.reset();
    this.participantes = [];
    this.horariosAsignados = [];
    this.editandoParticipante = false;
    this.editandoHorario = false;
    this.mostrarConfirmacion = false;
    this.mostrarModalInformativo = false;
    this.modalesInformativos = [];
    this.fichaActual = 0;
  }
}