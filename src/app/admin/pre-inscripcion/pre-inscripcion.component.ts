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
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';

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
    MatDialogModule
  ],
  templateUrl: './pre-inscripcion.component.html',
  styleUrls: ['./pre-inscripcion.component.css']
})
export class PreInscripcionComponent implements OnInit {
  
  // Formularios para cada paso
  apoderadoForm!: FormGroup;
  alumnoForm!: FormGroup;
  sedeDeporteForm!: FormGroup;
  documentosForm!: FormGroup;

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
    { value: '4', label: 'Ninguno' }
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

  // Datos de confirmación
  codigoRegistro = '';
  datosInscripcion: any = null;
  
  // Archivos subidos
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

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.inicializarFormularios();
    this.cargarDatosIniciales();
  }

  inicializarFormularios(): void {
    // PASO 1: Datos del Apoderado + Dirección
    this.apoderadoForm = this.fb.group({
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

    // PASO 2: Datos del Alumno
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
      tieneDiscapacidad: [false]
    });

    // PASO 3: Complejo Deportivo + Deporte + Horarios
    this.sedeDeporteForm = this.fb.group({
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
      
      // TODO: Reemplazar con llamada real a API RENIEC
      // this.http.get(`api/reniec/${dni}`).subscribe(...)
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

    // TODO: Reemplazar con llamada a API
    // this.http.get(`api/provincias/${depId}`).subscribe(...)
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

    // TODO: Reemplazar con llamada a API
    // this.http.get(`api/distritos/${provId}`).subscribe(...)
    if (provId === '1501') {
      this.distritos = [
        { value: '150101', label: 'LIMA' },
        { value: '150103', label: 'ATE' },
        { value: '150106', label: 'CHORRILLOS' },
        { value: '150110', label: 'VILLA EL SALVADOR' }
      ];
    }
  }

  // ==================== PASO 2: ALUMNO ====================
  
  buscarAlumno(): void {
    const dni = this.alumnoForm.get('numeroDocumento')?.value;
    
    if (dni && dni.length === 8) {
      this.cargandoAlumno = true;
      
      // TODO: Reemplazar con llamada real a API RENIEC
      // this.http.get(`api/reniec/${dni}`).subscribe(...)
      setTimeout(() => {
        this.alumnoForm.patchValue({
          apellidoPaterno: 'QUISPE',
          apellidoMaterno: 'HUARANCCA',
          nombres: 'EMILY IVET',
          fechaNacimiento: new Date('2008-09-13')
        });
        this.cargandoAlumno = false;
      }, 1000);
    }
  }

  onDiscapacidadChange(event: any): void {
    this.tieneDiscapacidad = event.checked;
    if (this.sedeDeporteForm.get('deporte')?.value) {
      this.onDeporteChange();
    }
  }

  // ==================== PASO 3: SEDE Y DEPORTE ====================
  
  onDepartamentoSedeChange(): void {
    const depId = this.sedeDeporteForm.get('departamento')?.value;
    this.provinciasSede = [];
    this.distritosSede = [];
    this.complejosDeportivos = [];
    this.deportes = [];
    this.horarios = [];
    this.horarioSeleccionado = null;
    this.mapaVisible = false;
    
    this.sedeDeporteForm.patchValue({ 
      provincia: '', 
      distrito: '', 
      complejoDeportivo: '',
      deporte: ''
    });

    // TODO: Reemplazar con llamada a API
    if (depId === '15') {
      this.provinciasSede = [{ value: '1501', label: 'LIMA' }];
    } else if (depId === '04') {
      this.provinciasSede = [{ value: '0401', label: 'AREQUIPA' }];
    }
  }

  onProvinciaSedeChange(): void {
    const provId = this.sedeDeporteForm.get('provincia')?.value;
    this.distritosSede = [];
    this.complejosDeportivos = [];
    this.deportes = [];
    this.horarios = [];
    this.horarioSeleccionado = null;
    this.mapaVisible = false;
    
    this.sedeDeporteForm.patchValue({ 
      distrito: '', 
      complejoDeportivo: '',
      deporte: ''
    });

    // TODO: Reemplazar con llamada a API
    if (provId === '1501') {
      this.distritosSede = [
        { value: '150110', label: 'VILLA EL SALVADOR' },
        { value: '150120', label: 'CHORRILLOS' }
      ];
    }
  }

  onDistritoSedeChange(): void {
    const distId = this.sedeDeporteForm.get('distrito')?.value;
    this.complejosDeportivos = [];
    this.deportes = [];
    this.horarios = [];
    this.horarioSeleccionado = null;
    this.mapaVisible = false;
    
    this.sedeDeporteForm.patchValue({ 
      complejoDeportivo: '',
      deporte: ''
    });

    // TODO: Reemplazar con llamada a API
    // this.http.get(`api/complejos/${distId}`).subscribe(...)
    if (distId === '150110') {
      this.complejosDeportivos = [
        { 
          value: '1', 
          label: 'Complejo Deportivo Villa El Salvador',
          lat: -12.2050,
          lng: -76.9350
        }
      ];
    } else if (distId === '150120') {
      this.complejosDeportivos = [
        { 
          value: '2', 
          label: 'Complejo Panamericano Costa Verde',
          lat: -12.1800,
          lng: -77.0200
        }
      ];
    }
  }

  onComplejoDeportivoChange(): void {
    const complejoId = this.sedeDeporteForm.get('complejoDeportivo')?.value;
    this.deportes = [];
    this.horarios = [];
    this.horarioSeleccionado = null;
    
    this.sedeDeporteForm.patchValue({ deporte: '' });
    
    // Mostrar mapa
    const complejo = this.complejosDeportivos.find(c => c.value === complejoId);
    if (complejo) {
      this.mapaVisible = true;
      this.ubicacionComplejo = {
        lat: complejo.lat,
        lng: complejo.lng,
        nombre: complejo.label
      };
    }

    // TODO: Reemplazar con llamada a API
    // this.http.get(`api/deportes/${complejoId}`).subscribe(...)
    if (complejoId === '1') {
      this.deportes = [
        { value: '1', label: 'Fútbol' },
        { value: '2', label: 'Básquet' }
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
    
    // TODO: Reemplazar con llamada a API
    // this.http.get(`api/horarios/${deporteId}?discapacidad=${this.tieneDiscapacidad}`).subscribe(...)
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

  // Método para obtener URL segura del mapa
  getMapaUrl(): SafeResourceUrl {
    if (!this.ubicacionComplejo) {
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    const url = `https://www.google.com/maps?q=${this.ubicacionComplejo.lat},${this.ubicacionComplejo.lng}&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // ==================== PASO 4: FINALIZAR ====================
  
  finalizarPreInscripcion(): void {
    if (!this.horarioSeleccionado) {
      alert('Debe seleccionar un horario de la tabla para continuar');
      return;
    }

    if (this.sedeDeporteForm.valid) {
      this.codigoRegistro = this.generarCodigoRegistro();

      const complejoSeleccionado = this.complejosDeportivos.find(
        c => c.value === this.sedeDeporteForm.value.complejoDeportivo
      );

      const deporteSeleccionado = this.deportes.find(
        d => d.value === this.sedeDeporteForm.value.deporte
      );

      this.datosInscripcion = {
        codigo: this.codigoRegistro,
        nombre: this.alumnoForm.value.nombres,
        apellidoPaterno: this.alumnoForm.value.apellidoPaterno,
        apellidoMaterno: this.alumnoForm.value.apellidoMaterno,
        distrito: this.distritos.find(d => d.value === this.apoderadoForm.value.distrito)?.label || '',
        domicilio: this.apoderadoForm.value.direccion,
        fechaNacimiento: this.alumnoForm.value.fechaNacimiento,
        telefono: '987654039',
        dni: this.alumnoForm.value.numeroDocumento,
        edad: this.calcularEdad(this.alumnoForm.value.fechaNacimiento),
        email: 'zluis.arias.01@gmail.com',
        complejo: complejoSeleccionado?.label || '',
        deporte: deporteSeleccionado?.label || '',
        modalidad: 'Convencional',
        etapa: this.horarioSeleccionado.etapa,
        horario: `${this.horarioSeleccionado.dias} de ${this.horarioSeleccionado.horas}`,
        fecha: new Date()
      };

      // MOSTRAR MODAL INFORMATIVO
      this.mostrarModalInformativo = true;
      
      // TODO: Aquí harías el POST a tu API
      // this.http.post('api/pre-inscripciones', this.datosInscripcion).subscribe(...)
    }
  }

  cerrarModalInformativo(): void {
    this.mostrarModalInformativo = false;
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

  descargarFichaPreinscripcion(): void {
    console.log('Descargando Ficha de Pre-inscripción...');
    // TODO: Generar PDF con los datos de this.datosInscripcion
    alert('Generando PDF de Ficha de Pre-inscripción...');
  }

  descargarDeclaracionJurada(): void {
    console.log('Descargando Declaración Jurada...');
    // TODO: Generar PDF con declaración jurada
    alert('Generando PDF de Declaración Jurada...');
  }

  abrirPasoDocumentos(): void {
    this.mostrarPasoDocumentos = true;
  }

  // ==================== PASO 5: DOCUMENTOS ====================
  
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

  enviarDocumentos(): void {
    const obligatorios = ['dniMenor', 'dniApoderado', 'seguroMedico', 'fichaPreinscripcion', 'declaracionJurada'];
    const faltantes = obligatorios.filter(tipo => !this.archivosSubidos[tipo]);

    if (faltantes.length > 0) {
      alert('Debe cargar todos los documentos obligatorios');
      return;
    }

    if (this.tieneDiscapacidad && !this.archivosSubidos.conadis) {
      alert('Debe cargar la Copia de Carné de CONADIS');
      return;
    }

    console.log('Enviando documentos:', this.archivosSubidos);
    
    // TODO: Aquí harías el upload a tu API usando FormData
    // const formData = new FormData();
    // for (const key in this.archivosSubidos) {
    //   if (this.archivosSubidos[key]) {
    //     formData.append(key, this.archivosSubidos[key]);
    //   }
    // }
    // this.http.post('api/documentos/' + this.codigoRegistro, formData).subscribe(...)
    
    alert('Documentos enviados correctamente. Su inscripción será validada en breve.');
    this.mostrarPasoDocumentos = false;
  }

  volverConfirmacion(): void {
    this.mostrarPasoDocumentos = false;
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
    this.apoderadoForm.reset({ tipoDocumento: '30' });
    this.alumnoForm.reset({ tipoDocumento: '30', tieneDiscapacidad: false });
    this.sedeDeporteForm.reset();
    this.documentosForm.reset();
    this.datosInscripcion = null;
    this.codigoRegistro = '';
    this.horarioSeleccionado = null;
    this.mapaVisible = false;
    this.mostrarPasoDocumentos = false;
    this.tieneDiscapacidad = false;
    this.mostrarModalInformativo = false;
  }
}