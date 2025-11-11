import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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
    MatCardModule
  ],
  templateUrl: './pre-inscripcion.component.html',
  styleUrls: ['./pre-inscripcion.component.css']
})
export class PreInscripcionComponent implements OnInit {
  
  // Formularios para cada paso
  apoderadoForm!: FormGroup;
  direccionForm!: FormGroup;
  participanteForm!: FormGroup;
  sedeForm!: FormGroup;
  horarioForm!: FormGroup;

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
    { value: '1', label: 'Padre' },
    { value: '2', label: 'Madre' },
    { value: '3', label: 'Tutor Legal' },
    { value: '4', label: 'Otro' }
  ];

  tiposSeguro = [
    { value: '1', label: 'SIS' },
    { value: '2', label: 'EsSalud' },
    { value: '3', label: 'Privado' },
    { value: '4', label: 'Ninguno' }
  ];

  departamentos: any[] = [];
  provincias: any[] = [];
  distritos: any[] = [];
  sedes: any[] = [];
  temporadas: any[] = [];
  disciplinas: any[] = [];
  horarios: any[] = [];
  turnos: any[] = [];

  cargandoApoderado = false;
  cargandoParticipante = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.inicializarFormularios();
    this.cargarDatosIniciales();
  }

  inicializarFormularios(): void {
    // Formulario Paso 1: Datos del Apoderado
    this.apoderadoForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.minLength(8)]],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      nombres: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required]
    });

    // Formulario Paso 2: Dirección
    this.direccionForm = this.fb.group({
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      direccion: ['', Validators.required],
      referencia: ['']
    });

    // Formulario Paso 3: Datos del Participante
    this.participanteForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.minLength(8)]],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      nombres: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      parentesco: ['', Validators.required],
      tipoSeguro: ['', Validators.required]
    });

    // Formulario Paso 4: Sede y Disciplina
    this.sedeForm = this.fb.group({
      sede: ['', Validators.required],
      temporada: ['', Validators.required],
      disciplina: ['', Validators.required]
    });

    // Formulario Paso 5: Horario
    this.horarioForm = this.fb.group({
      horario: ['', Validators.required],
      turno: ['', Validators.required],
      observaciones: ['']
    });
  }

  cargarDatosIniciales(): void {
    // Aquí cargarías los datos desde tu servicio/API
    // Por ahora dejamos datos de ejemplo
    this.departamentos = [
      { value: '15', label: 'LIMA' },
      { value: '01', label: 'AMAZONAS' },
      { value: '02', label: 'ANCASH' }
      // Agregar más departamentos según tu BD
    ];

    this.sedes = [
      { value: '1', label: 'Complejo Deportivo Villa El Salvador' },
      { value: '2', label: 'Complejo Deportivo San Luis' }
      // Agregar más sedes
    ];

    this.temporadas = [
      { value: '1', label: '2025 I - Enero - Abril' },
      { value: '2', label: '2025 II - Mayo - Agosto' }
    ];

    this.disciplinas = [
      { value: '1', label: 'Fútbol' },
      { value: '2', label: 'Vóley' },
      { value: '3', label: 'Básquet' }
    ];

    this.turnos = [
      { value: '1', label: 'Mañana' },
      { value: '2', label: 'Tarde' }
    ];
  }

  // Buscar datos del apoderado por DNI
  buscarApoderado(): void {
    const dni = this.apoderadoForm.get('numeroDocumento')?.value;
    
    if (dni && dni.length === 8) {
      this.cargandoApoderado = true;
      
      // Aquí harías la llamada al servicio para buscar el DNI
      // Simulamos una respuesta
      setTimeout(() => {
        // Ejemplo de autocompletar datos
        // this.apoderadoForm.patchValue({
        //   apellidoPaterno: 'PEREZ',
        //   apellidoMaterno: 'GOMEZ',
        //   nombres: 'JUAN CARLOS'
        // });
        this.cargandoApoderado = false;
      }, 1000);
    }
  }

  // Buscar datos del participante por DNI
  buscarParticipante(): void {
    const dni = this.participanteForm.get('numeroDocumento')?.value;
    
    if (dni && dni.length === 8) {
      this.cargandoParticipante = true;
      
      setTimeout(() => {
        this.cargandoParticipante = false;
      }, 1000);
    }
  }

  // Cambios en cascada para ubicación
  onDepartamentoChange(): void {
    const depId = this.direccionForm.get('departamento')?.value;
    // Cargar provincias según departamento
    this.provincias = [];
    this.distritos = [];
    this.direccionForm.patchValue({ provincia: '', distrito: '' });

    // Cargar provincias según departamento seleccionado
    if (depId === '15') { // LIMA
      this.provincias = [
        { value: '1501', label: 'LIMA' },
        { value: '1502', label: 'BARRANCA' },
        { value: '1503', label: 'CAÑETE' },
        { value: '1504', label: 'HUARAL' }
      ];
    } else if (depId === '01') { // AMAZONAS
      this.provincias = [
        { value: '0101', label: 'CHACHAPOYAS' },
        { value: '0102', label: 'BAGUA' },
        { value: '0103', label: 'BONGARÁ' }
      ];
    } else if (depId === '02') { // ANCASH
      this.provincias = [
        { value: '0201', label: 'HUARAZ' },
        { value: '0202', label: 'AIJA' },
        { value: '0203', label: 'BOLOGNESI' }
      ];
    }

  }

  onProvinciaChange(): void {
    const provId = this.direccionForm.get('provincia')?.value;
    // Cargar distritos según provincia
    this.distritos = [];
    this.direccionForm.patchValue({ distrito: '' });

    // Cargar distritos según provincia seleccionada
    if (provId === '1501') {
      this.distritos = [
        { value: '150101', label: 'LIMA' },
        { value: '150102', label: 'ANCON' },
        { value: '150103', label: 'ATE' },
        { value: '150104', label: 'BARRANCO' },
        { value: '150105', label: 'BREÑA' }
      ];
    } else if (provId === '0101') {
      this.distritos = [
        { value: '010101', label: 'CHACHAPOYAS' },
        { value: '010102', label: 'ASUNCIÓN' },
        { value: '010103', label: 'BALSAS' }
      ];
    } else if (provId === '0201') {
      this.distritos = [
        { value: '020101', label: 'HUARAZ' },
        { value: '020102', label: 'INDEPENDENCIA' },
        { value: '020103', label: 'JANGAS' }
      ];
    }

  }

  // Cambios en cascada para sede/disciplina
  onSedeChange(): void {
    const sedeId = this.sedeForm.get('sede')?.value;
    // Cargar disciplinas disponibles en la sede
  }

  onDisciplinaChange(): void {
    const disciplinaId = this.sedeForm.get('disciplina')?.value;
    // Cargar horarios disponibles
    this.horarios = [
      { value: '1', label: 'Lunes y Miércoles 8:00 - 10:00' },
      { value: '2', label: 'Martes y Jueves 15:00 - 17:00' }
    ];
  }

  // Enviar formulario completo
  enviarInscripcion(): void {
    if (this.horarioForm.valid) {
      const datosCompletos = {
        apoderado: this.apoderadoForm.value,
        direccion: this.direccionForm.value,
        participante: this.participanteForm.value,
        sede: this.sedeForm.value,
        horario: this.horarioForm.value
      };

      console.log('Datos de inscripción:', datosCompletos);
      
      // Aquí harías el POST a tu API
      alert('Pre-inscripción enviada correctamente!');
      
      // Opcional: redirigir o limpiar formulario
    }
  }

  // Solo permitir letras
  soloLetras(event: KeyboardEvent): boolean {
    const char = String.fromCharCode(event.keyCode);
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(char);
  }

  // Solo permitir números
  soloNumeros(event: KeyboardEvent): boolean {
    const char = String.fromCharCode(event.keyCode);
    return /^[0-9]+$/.test(char);
  }
}