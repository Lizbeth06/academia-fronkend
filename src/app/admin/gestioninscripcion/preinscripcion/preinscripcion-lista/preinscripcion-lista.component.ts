import { Component, inject, OnInit } from "@angular/core";

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

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
import { Tipodocumento } from '../../../../model/tipodocumento';
import { TipodocumentoService } from '../../../../services/tipodocumento.service';
import { UbigeoService } from '../../../../services/ubigeo.service';
import { Ubigeo } from '../../../../model/ubigeo.model';
import { Tiposeguro } from '../../../../model/tiposeguro.model';
import { TiposeguroService } from '../../../../services/tiposeguro.service';
import { Sede } from '../../../../model/sede.model';
import { SedeService } from '../../../../services/sede.service';
import { ApiExternoService } from '../../../../services/api-externo.service';
import { ApiDniResponse } from '../../../../model/apiDniResponse.model';
import { DocumentConfig } from '../../../../util/tipodocumentoConfig.util';
import { DisciplinaService } from '../../../../services/disciplina.service';
import { ApoderadoService } from '../../../../services/apoderado.service';
import { ParticipanteService } from '../../../../services/participante.service';
import { Participante } from '../../../../model/participante.model';
import { TiporelacionService } from '../../../../services/tiporelacion.service';
import { Tiporelacion } from '../../../../model/tiporelacion.model';
import { ListahorarioService } from '../../../../services/listahorario.service';
import { InscripcionService } from '../../../../services/inscripcion.service';
import { Estado, Inscripcion, Tipoinscripcion } from '../../../../model/inscripcion';
import { Listahorario } from '../../../../model/listahorario';
import { Apoderado } from '../../../../model/apoderado.model';
import { ModalService } from '../../../../util/modal.service';
import { Apoderadoparticipante } from '../../../../model/apoderadoparticipante.model';
import { ApoderadoparticipanteService } from '../../../../services/apoderadoparticipante.service';
import { Persona } from "../../../../model/persona";

// Formato de fecha personalizado
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "DD/MM/YYYY",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

// Interface para participante
// export interface Participante {
//   id: number;
//   tipoDocumento: string;
//   numeroDocumento: string;
//   apellidoPaterno: string;
//   apellidoMaterno: string;
//   nombres: string;
//   fechaNacimiento: Date;
//   sexo: string;
//   tipoRelacionApoderado: string;
//   tipoSeguro: string;
//   tieneDiscapacidad: boolean;
//   modalidadEnvio: 'digital' | 'presencial' | null;
//   archivosDigitales?: {
//     dniMenor: File | null;
//     dniApoderado: File | null;
//     conadis: File | null;
//     seguroMedico: File | null;
//     declaracionJurada: File | null;
//   };
//   horarioAsignado?: HorarioAsignado | null;
// }

// Interface para horario asignado
export interface HorarioAsignado {
  participanteId: string; //Numero de documento
  participanteNombre: string;
  departamento: string;
  provincia: string;
  distrito: string;
  complejoDeportivo: string;
  complejoDeportivoNombre: string;
  deporte: string;
  deporteNombre: string;
  horario: HorarioView;
}

// Interface para modal informativo
export interface ModalInformativo {
  participante: ParticipanteView;
  modalidad: 'digital' | 'presencial';
  codigoRegistro: string;
}

export interface HorarioView {
  idHorario: number,
  edad: string,
  etapa: string,
  dias: string,
  horas: string,
  deporte: string,
  numeroPreinscripcionesDisponibles: number,
}

export interface ParticipanteView {
  tipoDocumento: number,
  numeroDocumento: string,
  apellidoPaterno: string,
  apellidoMaterno: string,
  nombres: string,
  fechaNacimiento: Date,
  sexo: number,
  tipoRelacionApoderado: number,
  tipoSeguro: number,
  tieneDiscapacidad: boolean
}

export interface FichaView {
  idInscripcion: number,
  codigo: string,
  nombres: string,
  apellidoPaterno: string,
  apellidoMaterno: string,
  domicilio: string,
  fechaNacimiento: string,
  documento: string,
  edad: number,
  disciplina: string,
  etapa: string,
  sede: string,
  complejo: string,
  horario: string
}

@Component({
  selector: "app-pre-inscripcion",
  standalone: true,
  imports: [
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
    MatExpansionModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "es-PE" },
  ],
  templateUrl: "./preinscripcion-lista.component.html",
  styleUrl: "./preinscripcion-lista.component.css",
})
export class PreInscripcionComponent implements OnInit {
  // Formularios para cada paso
  apoderadoForm!: FormGroup;
  alumnoForm!: FormGroup;
  sedeDeporteForm!: FormGroup;
  documentosForm!: FormGroup;

  //  Participantes
  participantes: ParticipanteView[] = [];
  participanteActualIndex: number = 0;
  editandoParticipante: boolean = false;

  //  NUEVO: Horarios asignados
  horariosAsignados: HorarioAsignado[] = [];
  participanteSeleccionadoId: string | null = null;
  editandoHorario: boolean = false;
  horarioActualIndex: number = 0;

  //  NUEVO: Modalidad envío
  // modalidadEnvioActual: 'digital' | 'presencial' | null = null;

  // NUEVO: Mensaje de error de formulario;
  msgErrorNroDocApoderado: "Debe ingresar 8 dígitos" | "Debe ingresar entre 9 y 20 digitos" = "Debe ingresar 8 dígitos";
  msgErrorNroDocAlumno: "Debe ingresar 8 dígitos" | "Debe ingresar entre 9 y 20 digitos" = "Debe ingresar 8 dígitos";

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
      declaracionJurada: null,
    };

  //  NUEVO: Modales informativos
  modalesInformativos: ModalInformativo[] = [];
  modalInformativoActual: ModalInformativo | null = null;
  indiceModalActual: number = 0;

  // NUEVO: Carousel de fichas
  fichaActual: number = 0;

  // NUEVO: Tipo de Apoderado
  tiposApoderado = [
    { value: "papa", label: "Papá" },
    { value: "mama", label: "Mamá" },
    { value: "tio", label: "Tío(a)" },
    { value: "otros", label: "Otros" },
  ];

  // Opciones para los dropdowns
  tiposDocumento: Tipodocumento[] = [];

  generos = ['FEMENINO', 'MASCULINO', 'OTROS'];

  tiposRelacionApoderado: Tiporelacion[] = [];

  tiposSeguro: Tiposeguro[] = [];

  // Datos para ubicación
  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];

  // Datos para sede/deporte
  departamentosSede: Ubigeo[] = [];
  provinciasSede: Ubigeo[] = [];
  distritosSede: Ubigeo[] = [];
  complejosDeportivos: Sede[] = [];
  deportes = new Set<string>();
  horarios: HorarioView[] = [];
  horariosFiltrados: HorarioView[] = [];

  //Datos de inscripcines
  fichasInscripcion: FichaView[] = [];

  // Estados de carga
  cargandoApoderado = false;
  cargandoAlumno = false;
  tieneDiscapacidad = false;
  horarioSeleccionado: HorarioView | null = null;

  // Modal informativo
  mostrarModalInformativo = false;

  datosInformativos?: any[];

  // Datos de confirmación
  codigoRegistro = "";
  datosInscripcion: any = null;

  // Archivos subidos (legacy - ahora por participante)
  archivosSubidos: any = {
    dniMenor: null,
    dniApoderado: null,
    conadis: null,
    seguroMedico: null,
    fichaPreinscripcion: null,
    declaracionJurada: null,
  };

  // Mapa
  mapaVisible = false;
  ubicacionComplejo: any = null;

  // Mostrar paso de documentos
  mostrarPasoDocumentos = false;
  mostrarConfirmacion = false;

  //Servicios
  tipodocumentoService = inject(TipodocumentoService);
  ubigeoService = inject(UbigeoService);
  tiposeguroService = inject(TiposeguroService);
  sedeService = inject(SedeService);
  apiExternoService = inject(ApiExternoService);
  disciplinaService = inject(DisciplinaService);
  apoderadoService = inject(ApoderadoService);
  participanteService = inject(ParticipanteService);
  tiporelacionService = inject(TiporelacionService);
  listahorarioService = inject(ListahorarioService);
  inscripcionService = inject(InscripcionService);
  apoderadoparticipanteService = inject(ApoderadoparticipanteService);
  modalService = inject(ModalService);

  //Selecteds de tipo de documento
  selectedConfig: DocumentConfig | null = null;
  selectedConfigAlumno: DocumentConfig | null = null;

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.inicializarFormularios();
    this.cargarDatosIniciales();
    this.inscripcionService.findById(1).subscribe(data => console.log(data));
    this.inscripcionService.findAll().subscribe(data => console.log(data));
  }

  inicializarFormularios(): void {
    // PASO 1: Datos del Apoderado + Dirección ( NUEVO: tipoApoderado)
    this.apoderadoForm = this.fb.group({
      tipoDocumento: [1, Validators.required],
      numeroDocumento: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^\d{8}$/)]],
      apellidoPaterno: ["", Validators.required],
      apellidoMaterno: ["", Validators.required],
      nombres: ["", Validators.required],
      fechaNacimiento: ["", Validators.required],
      sexo: [1, Validators.required],
      departamento: ["", Validators.required],
      provincia: ["", Validators.required],
      distrito: ["", Validators.required],
      direccion: ["", Validators.required],
      correo: ["", Validators.email],
      telefono: ["", Validators.pattern(/^\d{9}$/)],
    });

    // PASO 2: Datos del Alumno ( NUEVO: modalidadEnvio)
    this.alumnoForm = this.fb.group({
      tipoDocumento: [1, Validators.required],
      numeroDocumento: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern(/^\d{8}$/)
      ]],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      nombres: ['', Validators.required],
      fechaNacimiento: [<Date | undefined>undefined, Validators.required],
      sexo: [1, Validators.required],
      tipoRelacionApoderado: [1, Validators.required],
      tipoSeguro: [1, Validators.required],
      tieneDiscapacidad: [false],
      // modalidadEnvio: [null, Validators.required]
    });

    // PASO 3: Complejo Deportivo + Deporte + Horarios
    this.sedeDeporteForm = this.fb.group({
      participante: ["", Validators.required],
      departamento: ["", Validators.required],
      provincia: ["", Validators.required],
      distrito: ["", Validators.required],
      complejoDeportivo: ["", Validators.required],
      deporte: ["", Validators.required],
    });

    // PASO 5: Documentos
    this.documentosForm = this.fb.group({
      dniMenor: [null],
      dniApoderado: [null],
      conadis: [null],
      seguroMedico: [null],
      fichaPreinscripcion: [null],
      declaracionJurada: [null],
    });
  }

  cargarDatosIniciales(): void {
    //Tipos de documentos de identidad
    this.tipodocumentoService.findAll().subscribe((data) => {
      this.tiposDocumento = data;
    });

    //Departamentos
    this.ubigeoService.findAllDepartments().subscribe((data) => {
      //Apoderado
      this.departamentos = data;
      //sedes
      this.departamentosSede = data;
    });

    //Tipos de seguro
    this.tiposeguroService.findAll().subscribe((data) => {
      this.tiposSeguro = data;
    });

    //Tipos de relacion con el apoderado
    this.tiporelacionService.findAll().subscribe(data => {
      this.tiposRelacionApoderado = data;
    });

    // Datos para dirección del apoderado
    // this.departamentos = [
    //   { value: '15', label: 'LIMA' },
    //   { value: '01', label: 'AMAZONAS' },
    //   { value: '02', label: 'ANCASH' },
    //   { value: '03', label: 'APURÍMAC' },
    //   { value: '04', label: 'AREQUIPA' }
    // ];

    // Datos para sede deportiva
    // this.departamentosSede = [
    //   { value: '15', label: 'LIMA' },
    //   { value: '04', label: 'AREQUIPA' }
    // ];
  }

  // ==================== PASO 1: APODERADO ====================

  buscarApoderado(): void {
    const tipoDoc = this.apoderadoForm.get("tipoDocumento")?.value;
    const dni = this.apoderadoForm.get("numeroDocumento")?.value;

    this.cargandoApoderado = true;

    this.limpiarFormularioApoderado();
    this.apoderadoForm.patchValue({
      numeroDocumento: dni,
    });

    this.apoderadoService.findByDocumento(tipoDoc, dni).subscribe({
      next: (data) => {
        console.log("Entró dentro de este flujo");
        console.log(data);
        this.apoderadoForm.patchValue({
          apellidoPaterno: data.persona.amaterno,
          apellidoMaterno: data.persona.apaterno,
          nombres: data.persona.nombres,
          fechaNacimiento: data.persona.fnacimiento,
          sexo: data.persona.genero,
          departamento: data.persona.ubigeo.ubiDpto,
          provincia: data.persona.ubigeo.ubiProvincia,
          distrito: data.persona.ubigeo.idUbigeo,
          direccion: data.persona.direccion,
          correo: data.persona.correo,
          telefono: data.persona.telefono,
        });
        this.ubigeoService.findProvincias(data.persona.ubigeo.ubiDpto!).subscribe((data) => {
          this.provincias = data;
        });
        this.ubigeoService.findDistritos(data.persona.ubigeo.ubiDpto!, data.persona.ubigeo.ubiProvincia!).subscribe((data) => {
          this.distritos = data;
        });
        this.cargandoApoderado = false;
      },
      error: (err) => {
        console.log("Entró dentro del flujo de error");
        this.apiExternoService.findPersonaByDNI(dni).subscribe({
          next: (data: ApiDniResponse) => {
            if (data.code == 200) {
              this.apoderadoForm.patchValue({
                apellidoPaterno: data.personal.apPrimer,
                apellidoMaterno: data.personal.apSegundo,
                nombres: data.personal.prenombres,
              });
            }
            this.cargandoApoderado = false;
          },
          error: (error: any) => {
            this.cargandoApoderado = false;
          },
        });
      },
    });

    // if (dni && dni.length === 8) {
    //   this.cargandoApoderado = true;

    //   setTimeout(() => {
    //     this.apoderadoForm.patchValue({
    //       apellidoPaterno: 'ARIAS',
    //       apellidoMaterno: 'CAMPOS',
    //       nombres: 'LUIS ALFONSO',
    //       fechaNacimiento: new Date('1985-03-15')
    //     });
    //     this.cargandoApoderado = false;
    //   }, 1000);
    // }
  }

  onDepartamentoChange(): void {
    const depId = this.apoderadoForm.get("departamento")?.value;
    // this.provincias = [];
    this.ubigeoService.findProvincias(depId).subscribe((data) => {
      this.provincias = data;
    });
    this.distritos = [];
    this.apoderadoForm.patchValue({ provincia: "", distrito: "" });

    // if (depId === '15') {
    //   this.provincias = [
    //     { value: '1501', label: 'LIMA' },
    //     { value: '1502', label: 'BARRANCA' }
    //   ];
    // } else if (depId === '04') {
    //   this.provincias = [
    //     { value: '0401', label: 'AREQUIPA' }
    //   ];
    // }
  }

  onProvinciaChange(): void {
    const depId = this.apoderadoForm.get("departamento")?.value;
    const provId = this.apoderadoForm.get("provincia")?.value;
    this.ubigeoService.findDistritos(depId, provId).subscribe((data) => {
      this.distritos = data;
    });
    // this.distritos = [];
    this.apoderadoForm.patchValue({ distrito: "" });

    // if (provId === '1501') {
    //   this.distritos = [
    //     { value: '150101', label: 'LIMA' },
    //     { value: '150103', label: 'ATE' },
    //     { value: '150106', label: 'CHORRILLOS' },
    //     { value: '150114', label: 'LA MOLINA' },
    //     { value: '150117', label: 'LINCE' }
    //   ];
    // } else if (provId === '0401') {
    //   this.distritos = [
    //     { value: '040101', label: 'AREQUIPA' }
    //   ];
    // }
  }

  // ==================== PASO 2: PARTICIPANTES (MÚLTIPLES) ====================

  buscarAlumno(): void {
    const tipoDoc = this.alumnoForm.get("tipoDocumento")?.value;
    const dni = this.alumnoForm.get("numeroDocumento")?.value;

    this.limpiarFormularioAlumno();
    this.alumnoForm.patchValue({
      numeroDocumento: dni,
    });

    if (dni) {
      this.cargandoAlumno = true;

      this.participanteService.findByDocumento(tipoDoc, dni).subscribe({
        next: (data) => {
          this.alumnoForm.patchValue({
            apellidoPaterno: data.persona.apaterno,
            apellidoMaterno: data.persona.amaterno,
            nombres: data.persona.nombres,
            fechaNacimiento: data.persona.fnacimiento,
            sexo: data.persona.genero,
            tipoSeguro: undefined,
            // tipoSeguro: data.tiposeguro.idTiposeguro,
            tieneDiscapacidad: data.presentaDiscapacidad
          });
          //TODO: Encontrar la relacion entre apoderado y alumno
          const idTipoDocApoderado = this.apoderadoForm.get('tipoDocumento')?.value;
          const numDocumentoApoderado = this.apoderadoForm.get('numeroDocumento')?.value;
          const idTipoDocAlumno = this.alumnoForm.get('tipoDocumento')?.value;
          const numDocumentoAlumno = this.alumnoForm.get('numeroDocumento')?.value;
          this.apoderadoparticipanteService.findByDocumento(
            idTipoDocApoderado,
            numDocumentoApoderado,
            idTipoDocAlumno,
            numDocumentoAlumno
          ).subscribe({
            next: (data) => {
              this.alumnoForm.patchValue({
                tipoRelacionApoderado: data.tiporelacion.idTiporelacion
              });
            },
            error: (error) => {
              this.alumnoForm.patchValue({
                tipoRelacionApoderado: undefined
              });
            }
          });
          // this.apoderadoService.findRelacionParticipante()
          this.cargandoAlumno = false;
        },
        error: (error) => {
          this.cargandoAlumno = false;
        },
      });

      // setTimeout(() => {
      //   this.alumnoForm.patchValue({
      //     apellidoPaterno: 'GARCÍA',
      //     apellidoMaterno: 'LÓPEZ',
      //     nombres: 'MARÍA FERNANDA',
      //     fechaNacimiento: new Date('2010-05-20')
      //   });
      //   this.cargandoAlumno = false;
      // }, 1000);
    }
  }

  //  NUEVO: Verificar si formulario básico está completo (sin modalidad)
  formularioBasicoCompleto(): boolean {
    const form = this.alumnoForm;
    return !!(
      form.get("tipoDocumento")?.value &&
      form.get("numeroDocumento")?.valid &&
      form.get("apellidoPaterno")?.value &&
      form.get("apellidoMaterno")?.value &&
      form.get("nombres")?.value &&
      form.get("fechaNacimiento")?.value &&
      form.get("sexo")?.value &&
      form.get("tipoRelacionApoderado")?.value &&
      form.get("tipoSeguro")?.value &&
      form.get("tieneDiscapacidad")?.value !== null
    );
  }

  onDiscapacidadChange(event: any): void {
    this.tieneDiscapacidad = event.checked;
  }

  //  NUEVO: Manejar cambio de modalidad de envío (puede cambiar libremente)
  // onModalidadEnvioChange(modalidad: 'digital' | 'presencial'): void {
  //   // Si clickea la misma opción, la desmarca
  //   if (this.modalidadEnvioActual === modalidad) {
  //     this.modalidadEnvioActual = null;
  //     this.alumnoForm.patchValue({ modalidadEnvio: null });
  //   } else {
  //     // Cambia a la nueva opción
  //     this.modalidadEnvioActual = modalidad;
  //     this.alumnoForm.patchValue({ modalidadEnvio: modalidad });
  //   }
  // }

  // Agregar participante al array
  agregarParticipante(): void {
    if (this.alumnoForm.valid) {
      // const nuevoParticipante: Participante = {
      //   id: this.participantes.length + 1,
      //   ...this.alumnoForm.value,
      //   // archivosDigitales: this.alumnoForm.value.modalidadEnvio === 'digital' ? {
      //   //   dniMenor: this.archivosDigitalesTemp.dniMenor,
      //   //   dniApoderado: this.archivosDigitalesTemp.dniApoderado,
      //   //   conadis: this.archivosDigitalesTemp.conadis,
      //   //   seguroMedico: this.archivosDigitalesTemp.seguroMedico,
      //   //   declaracionJurada: this.archivosDigitalesTemp.declaracionJurada
      //   // } : undefined,
      //   horarioAsignado: null
      // };
      const alumnoFormValues = this.alumnoForm.value;
      const nuevoParticipante: ParticipanteView = { ...alumnoFormValues }

      this.participantes.push(nuevoParticipante);
      this.limpiarFormularioAlumno();

      setTimeout(() => {
        const elemento = document.querySelector(".participantes-agregados");
        elemento?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      alert("Por favor complete todos los campos obligatorios del participante");
    }
  }

  limpiarFormularioApoderado(): void {
    this.apoderadoForm.reset({
      tipoDocumento: 1,
      sexo: 1,
    });
    this.apoderadoForm.markAsPristine();
    this.apoderadoForm.markAsUntouched();
  }

  limpiarFormularioAlumno(): void {
    this.alumnoForm.reset({
      tipoDocumento: 1,
      sexo: 1,
      tipoRelacionApoderdo: 1,
      tipoSeguro: 1,
      tieneDiscapacidad: false,
    });
    // this.alumnoForm.markAsPristine();
    this.alumnoForm.markAsUntouched({emitEvent: true});

    this.tieneDiscapacidad = false;
    // this.modalidadEnvioActual = null;

    //  Limpiar archivos temporales
    this.archivosDigitalesTemp = {
      dniMenor: null,
      dniApoderado: null,
      conadis: null,
      seguroMedico: null,
      declaracionJurada: null,
    };
  }

  editarParticipante(participante: ParticipanteView): void {
    this.editandoParticipante = true;
    this.participanteActualIndex = this.participantes.findIndex(p => p.numeroDocumento === participante.numeroDocumento);

    this.alumnoForm.patchValue({ ...participante });

    this.tieneDiscapacidad = participante.tieneDiscapacidad;
    // this.modalidadEnvioActual = participante.modalidadEnvio;

    setTimeout(() => {
      const elemento = document.querySelector(".form-card");
      elemento?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  actualizarParticipante(): void {
    if (this.alumnoForm.valid && this.editandoParticipante) {
      this.participantes[this.participanteActualIndex] = {
        ...this.participantes[this.participanteActualIndex],
        ...this.alumnoForm.value,
        id: this.participantes[this.participanteActualIndex].numeroDocumento
      };

      this.editandoParticipante = false;
      this.limpiarFormularioAlumno();
    }
  }

  cancelarEdicion(): void {
    this.editandoParticipante = false;
    this.limpiarFormularioAlumno();
  }

  eliminarParticipante(participante: ParticipanteView): void {
    if (confirm(`¿Está seguro de eliminar al participante ${participante.nombres} ${participante.apellidoMaterno}?`)) {
      this.participantes = this.participantes.filter(p => p.numeroDocumento !== participante.numeroDocumento);
      // También eliminar horarios asignados
      this.horariosAsignados = this.horariosAsignados.filter(h => h.participanteId !== participante.numeroDocumento);
    }
  }

  puedeAvanzarPaso2(): boolean {
    return this.participantes.length > 0 && !this.editandoParticipante;
  }

  getLabelFromValue(array: any[], value: string): string {
    const item = array.find((i) => i.value === value);
    return item ? item.label : value;
  }

  //  NUEVO: Subir archivos digitales temporales (formulario actual)
  onFileSelectTemp(event: any, tipo: "dniMenor" | "dniApoderado" | "conadis" | "seguroMedico" | "declaracionJurada"): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Solo se permiten archivos PDF, JPG o PNG");
        event.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo no debe superar los 5MB");
        event.target.value = "";
        return;
      }

      // Guardar archivo en archivosDigitalesTemp
      this.archivosDigitalesTemp[tipo] = file;
    }
  }

  //  NUEVO: Obtener nombre de archivo temporal
  getNombreArchivoTemp(tipo: "dniMenor" | "dniApoderado" | "conadis" | "seguroMedico" | "declaracionJurada"): string {
    if (this.archivosDigitalesTemp[tipo]) {
      return this.archivosDigitalesTemp[tipo]!.name;
    }
    return "Ningún archivo";
  }

  //  NUEVO: Subir archivos digitales por participante
  onFileSelectParticipante(event: any, participante: Participante, tipo: string): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Solo se permiten archivos PDF, JPG o PNG");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo no debe superar los 5MB");
        return;
      }

      // if (participante.archivosDigitales) {
      //   (participante.archivosDigitales as any)[tipo] = file;
      // }
    }
  }

  // getNombreArchivoParticipante(participante: Participante, tipo: string): string {
  //   if (participante.archivosDigitales && (participante.archivosDigitales as any)[tipo]) {
  //     return (participante.archivosDigitales as any)[tipo].name;
  //   }
  //   return 'Ningún archivo seleccionado';
  // }

  //  NUEVO: Validar archivos digitales del formulario actual
  // formularioTieneArchivosDigitalesCompletos(): boolean {
  //   // Si no es digital, no necesita archivos
  //   if (this.modalidadEnvioActual !== 'digital') {
  //     return true;
  //   }

  //   const archivos = this.archivosDigitalesTemp;
  //   const tieneDiscapacidad = this.alumnoForm.get('tieneDiscapacidad')?.value;

  //   // Validar archivos obligatorios
  //   const tieneObligatorios = !!(
  //     archivos.dniMenor &&
  //     archivos.dniApoderado &&
  //     archivos.seguroMedico &&
  //     archivos.declaracionJurada
  //   );

  //   // Si tiene discapacidad, también necesita CONADIS
  //   if (tieneDiscapacidad) {
  //     return tieneObligatorios && !!archivos.conadis;
  //   }

  //   return tieneObligatorios;
  // }

  //  NUEVO: Validar que tiene archivos digitales completos
  // tieneArchivosDigitalesCompletos(participante: Participante): boolean {
  //   if (participante.modalidadEnvio !== 'digital' || !participante.archivosDigitales) {
  //     return false;
  //   }

  //   const archivos = participante.archivosDigitales;
  //   const obligatorios = ['dniMenor', 'dniApoderado', 'seguroMedico', 'declaracionJurada'];

  //   for (const tipo of obligatorios) {
  //     if (!(archivos as any)[tipo]) {
  //       return false;
  //     }
  //   }

  //   if (participante.tieneDiscapacidad && !archivos.conadis) {
  //     return false;
  //   }

  //   return true;
  // }

  // NUEVO: Habilitar descarga de Declaración Jurada
  // puedeDescargarDeclaracionJurada(participante: Participante): boolean {
  //   return participante.modalidadEnvio === 'digital' &&
  //     !!participante.nombres &&
  //     !!participante.numeroDocumento;
  // }

  //  NUEVO: Generar Declaración Jurada desde formulario (antes de agregar)
  generarDeclaracionJuradaFormulario(ficha: FichaView): void {
    // console.log('Generando Ficha de Pre-inscripción para:', `${ficha.nombres} `);
    // TODO: Implementar generación de PDF
    // alert(`Generando Ficha de Pre-inscripción para ${participante.nombres} ${participante.apellidoPaterno}...`);
    this.inscripcionService.generarDeclaracionJurada(ficha.idInscripcion).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'ficha-inscripcion.pdf'; // nombre del archivo
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        alert(`Error al descargar: ${err}`);
      }
    });
  }

  // NUEVO: Generar Declaración Jurada
  generarDeclaracionJurada(ficha: FichaView): void {
    // console.log('Generando Ficha de Pre-inscripción para:', `${ficha.nombres} `);
    // TODO: Implementar generación de PDF
    // alert(`Generando Ficha de Pre-inscripción para ${participante.nombres} ${participante.apellidoPaterno}...`);
    this.inscripcionService.generarDeclaracionJurada(ficha.idInscripcion).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'declaracion-jurada.pdf'; // nombre del archivo
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        alert(`Error al descargar: ${err}`);
      }
    });
  }

  // Continúa en siguiente parte...

  // ==================== PASO 3: HORARIOS POR PARTICIPANTE ====================

  onParticipanteChange(): void {
    console.log("Se seleccionó el paticipante");
    console.log(this.participantes);
    const participanteId = this.sedeDeporteForm.get("participante")?.value;
    console.log(participanteId);
    this.participanteSeleccionadoId = participanteId;
    // Limpiar selecciones
    this.sedeDeporteForm.patchValue({
      departamento: "",
      provincia: "",
      distrito: "",
      complejoDeportivo: "",
      deporte: "",
    });
    this.deportes.clear();
    this.horarios = [];
    this.horarioSeleccionado = null;
  }

  onDepartamentoSedeChange(): void {
    const depId = this.sedeDeporteForm.get("departamento")?.value;
    // this.provinciasSede = [];
    this.ubigeoService.findProvincias(depId).subscribe((data) => {
      this.provinciasSede = data;
    });
    this.distritosSede = [];
    this.complejosDeportivos = [];
    this.deportes.clear();
    this.horarios = [];
    this.sedeDeporteForm.patchValue({ provincia: "", distrito: "", complejoDeportivo: "", deporte: "" });

    // if (depId === '15') {
    //   this.provinciasSede = [
    //     { value: '1501', label: 'LIMA' }
    //   ];
    // } else if (depId === '04') {
    //   this.provinciasSede = [
    //     { value: '0401', label: 'AREQUIPA' }
    //   ];
    // }
  }

  onProvinciaSedeChange(): void {
    const provId = this.sedeDeporteForm.get("provincia")?.value;
    // this.distritosSede = [];
    this.ubigeoService.findDistritos(this.sedeDeporteForm.get("departamento")?.value, provId).subscribe((data) => {
      this.distritosSede = data;
    });
    this.complejosDeportivos = [];
    this.deportes.clear();
    this.horarios = [];
    this.sedeDeporteForm.patchValue({ distrito: "", complejoDeportivo: "", deporte: "" });

    // if (provId === '1501') {
    //   this.distritosSede = [
    //     { value: '150101', label: 'LIMA' },
    //     { value: '150130', label: 'SAN LUIS' },
    //     { value: '150132', label: 'SAN MARTÍN DE PORRES' }
    //   ];
    // } else if (provId === '0401') {
    //   this.distritosSede = [
    //     { value: '040101', label: 'AREQUIPA' }
    //   ];
    // }
  }

  onDistritoSedeChange(): void {
    const distId = this.sedeDeporteForm.get("distrito")?.value;
    // this.complejosDeportivos = [];
    this.sedeService.findAllByCodubi(distId).subscribe((data) => {
      this.complejosDeportivos = data;
    });
    this.deportes.clear();
    this.horarios = [];
    this.sedeDeporteForm.patchValue({ complejoDeportivo: "", deporte: "" });

    // if (distId === '150101') {
    //   this.complejosDeportivos = [
    //     { value: '1', label: 'Estadio Nacional', lat: -12.0682, lng: -77.0321 }
    //   ];
    // } else if (distId === '150130') {
    //   this.complejosDeportivos = [
    //     { value: '2', label: 'Polideportivo San Luis', lat: -12.0730, lng: -77.0055 }
    //   ];
    // }
  }

  onComplejoDeportivoChange(): void {
    const complejoId = this.sedeDeporteForm.get("complejoDeportivo")?.value;
    // this.deportes = [];
    this.deportes.clear();
    this.horariosFiltrados = [];
    // this.horarios = [];
    const participante: ParticipanteView = this.participantes.find(p => p.numeroDocumento === this.participanteSeleccionadoId)!;
    this.listahorarioService.findDisponibles(
      this.calcularEdad(participante.fechaNacimiento),
      participante.tieneDiscapacidad ? 1 : 2,
      complejoId,
    )
      // this.listahorarioService.findAll(
      // )
      .subscribe(data => {
        this.horarios = data.map<HorarioView>(lh => {
          this.deportes.add(lh.horario.listadisciplina.disciplina.descripcion ?? '');
          return <HorarioView>{
            idHorario: lh.idListahorario,
            edad: lh.horario.categoriaedad.edadminima + ' - ' + lh.horario.categoriaedad.edadmaxima,
            etapa: lh.horario.nivel?.descripcion ?? '',
            dias: lh.horario.turno.listadia?.map(ld => ld.dias?.descripcion?.toUpperCase().slice(0, 3)).join(' - ') ?? '',
            horas: lh.horario.turno.horainicio?.slice(0, 5) + ' - ' + lh.horario.turno.horafin?.slice(0, 5),
            deporte: lh.horario.listadisciplina.disciplina.descripcion ?? '',
            numeroPreinscripcionesDisponibles: lh.horario.limitePreinscripcion - lh.horario.contador
          }
        });
      });
    this.horarioSeleccionado = null;

    this.sedeDeporteForm.patchValue({ deporte: "" });

    const complejo = this.complejosDeportivos.find((c) => c.idSede === complejoId);
    if (complejo) {
      this.mapaVisible = true;
      this.ubicacionComplejo = {
        lat: complejo.latitud,
        lng: complejo.longitud,
        nombre: complejo.nombre,
      };
    }

    // if (complejoId === '1') {
    //   this.deportes = [
    //     { value: '1', label: 'Fútbol' },
    //     { value: '2', label: 'Básquet' },
    //     { value: '3', label: 'Natación' },
    //     { value: '4', label: 'Voleibol' },
    //     { value: '5', label: 'Atletismo' }
    //   ];
    // } else if (complejoId === '2') {
    //   this.deportes = [
    //     { value: '4', label: 'Voleibol' },
    //     { value: '5', label: 'Atletismo' }
    //   ];
    // }
  }

  onDeporteChange(): void {
    const deporte = this.sedeDeporteForm.get('deporte')?.value;
    this.horariosFiltrados = this.horarios.filter(h => h.deporte === deporte);
    this.horarioSeleccionado = null;

    // if (deporteId === '1') {
    //   this.horarios = [
    //     {
    //       id: '1',
    //       edad: '8-12 años',
    //       etapa: 'Masificación',
    //       dias: 'Lun, Mié, Vie',
    //       horas: '15:00 - 17:00'
    //     },
    //     {
    //       id: '2',
    //       edad: '13-17 años',
    //       etapa: 'Iniciación',
    //       dias: 'Mar, Jue, Sáb',
    //       horas: '08:00 - 10:00'
    //     }
    //   ];
    // } else if (deporteId === '4') {
    //   this.horarios = [
    //     {
    //       id: '3',
    //       edad: '10-16 años',
    //       etapa: 'Masificación',
    //       dias: 'Sáb',
    //       horas: '12:00 - 12:45'
    //     },
    //     {
    //       id: '4',
    //       edad: '10-16 años',
    //       etapa: 'Masificación',
    //       dias: 'Mié, Vie',
    //       horas: '17:00 - 18:00'
    //     }
    //   ];
    // } else {
    //   this.horarios = [
    //     {
    //       id: '5',
    //       edad: '8-16 años',
    //       etapa: 'Iniciación',
    //       dias: 'Lun, Mié, Vie',
    //       horas: '15:30 - 18:30'
    //     }
    //   ];
    // }
  }

  seleccionarHorario(horario: HorarioView, event: any): void {
    if (event.checked) {
      this.horarioSeleccionado = horario;
    } else {
      if (this.horarioSeleccionado?.idHorario === horario.idHorario) {
        this.horarioSeleccionado = null;
      }
    }
  }

  esHorarioSeleccionado(horario: HorarioView): boolean {
    return this.horarioSeleccionado?.idHorario === horario.idHorario;
  }

  tieneHorarioSeleccionado(): boolean {
    return this.horarioSeleccionado !== null;
  }

  //  NUEVO: Agregar horario a participante
  agregarHorario(): void {
    if (!this.sedeDeporteForm.valid || !this.horarioSeleccionado) {
      alert("Por favor complete todos los campos y seleccione un horario");
      return;
    }

    const participanteId = this.sedeDeporteForm.value.participante;
    const participante = this.participantes.find(p => p.numeroDocumento === participanteId);

    if (!participante) {
      alert("Participante no encontrado");
      return;
    }

    // Verificar si ya tiene horario asignado
    const yaExiste = this.horariosAsignados.find((h) => h.participanteId === participanteId);
    if (yaExiste) {
      alert("Este participante ya tiene un horario asignado. Puede editarlo o eliminarlo.");
      return;
    }

    const nuevoHorario: HorarioAsignado = {
      participanteId: participante.numeroDocumento,
      participanteNombre: `${participante.nombres} ${participante.apellidoPaterno} ${participante.apellidoMaterno}`,
      departamento: this.sedeDeporteForm.value.departamento,
      provincia: this.sedeDeporteForm.value.provincia,
      distrito: this.sedeDeporteForm.value.distrito,
      complejoDeportivo: this.sedeDeporteForm.value.complejoDeportivo,
      complejoDeportivoNombre: this.complejosDeportivos.find((c) => c.idSede === this.sedeDeporteForm.value.complejoDeportivo)?.nombre || "",
      deporte: this.sedeDeporteForm.value.deporte,
      deporteNombre: this.sedeDeporteForm.value.deporte,
      horario: { ...this.horarioSeleccionado }
    };

    this.horariosAsignados.push(nuevoHorario);

    // Asignar al participante
    // participante.horarioAsignado = nuevoHorario;

    // Limpiar formulario
    this.limpiarFormularioHorario();

    setTimeout(() => {
      const elemento = document.querySelector(".horarios-agregados");
      elemento?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  yaExisteHorarioAsignado(participanteId: string): boolean {
    return this.horariosAsignados.some(h => h.participanteId === participanteId);
  }


  limpiarFormularioHorario(): void {
    // Limpiar TODOS los campos incluyendo el selector de participante
    this.sedeDeporteForm.reset();
    this.sedeDeporteForm.patchValue({
      participante: "",
      departamento: "",
      provincia: "",
      distrito: "",
      complejoDeportivo: "",
      deporte: "",
    });
    this.participanteSeleccionadoId = null;
    this.deportes.clear();
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
    alert("Función de editar horario en desarrollo");
  }

  //  NUEVO: Eliminar horario
  eliminarHorario(horario: HorarioAsignado): void {
    if (confirm(`¿Está seguro de eliminar el horario de ${horario.participanteNombre}?`)) {
      this.horariosAsignados = this.horariosAsignados.filter((h) => h.participanteId !== horario.participanteId);

      // Quitar del participante
      const participante = this.participantes.find(p => p.numeroDocumento === horario.participanteId);
      // if (participante) {
      //   participante.horarioAsignado = null;
      // }
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
      return this.horariosAsignados.some(horario => horario.participanteId === participante.numeroDocumento);
    });
  }

  getMapaUrl(): SafeResourceUrl {
    if (!this.ubicacionComplejo) {
      return this.sanitizer.bypassSecurityTrustResourceUrl("");
    }
    const url = `https://www.google.com/maps?q=${this.ubicacionComplejo.lat},${this.ubicacionComplejo.lng}&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // ==================== FINALIZAR Y MODALES ====================

  finalizarPreInscripcion(): void {
    if (this.horariosAsignados.length === 0) {
      alert("Debe asignar al menos un horario a un participante");
      return;
    }

    // Validar que TODOS los participantes tengan horario
    if (!this.puedeFinalizarInscripcion()) {
      alert("Todos los participantes deben tener un horario asignado antes de finalizar");
      return;
    }

    // Generar códigos de registro y modales para cada participante
    this.modalesInformativos = [];

    this.participantes.forEach(participante => {
      const horario = this.horariosAsignados.find(h => h.participanteId === participante.numeroDocumento);
      if (horario) {
        const codigoRegistro = this.generarCodigoRegistro();

        this.modalesInformativos.push({
          participante: participante,
          // modalidad: participante.modalidadEnvio || 'presencial',
          // modalidad: 'presencial',
          modalidad: 'digital',
          codigoRegistro: codigoRegistro
        });
      }
    });

    const apoderado = this.apoderadoForm.getRawValue();
    const inscripciones: Inscripcion[] = this.participantes.map<Inscripcion>(participanteView => {
      const horarioViewAsignado = this.horariosAsignados.find(h => h.participanteId === participanteView.numeroDocumento);
      return {
        finscripcion: new Date(),
        observacion: '',
        listahorario: { idListahorario: horarioViewAsignado?.horario.idHorario } as Listahorario,
        estado: { idEstado: 1 } as Estado,
        tiposeguro: { idTiposeguro: participanteView.tipoSeguro } as Tiposeguro,
        tipoinscripcion: { idTipoinscripcion: 1 } as Tipoinscripcion,
        apoderadoparticipante: {
          participante: {
            persona: {
              numDocumento: participanteView.numeroDocumento,
              nombres: participanteView.nombres,
              apaterno: participanteView.apellidoPaterno,
              amaterno: participanteView.apellidoMaterno,
              genero: participanteView.sexo,
              fnacimiento: participanteView.fechaNacimiento,
              tipodocumento: {
                idTipoDocumento: participanteView.tipoDocumento
              } as Tipodocumento
            } as Persona,
            presentaDiscapacidad: participanteView.tieneDiscapacidad,
          } as Participante,
          apoderado: {
            persona: {
              numDocumento: apoderado.numeroDocumento,
              nombres: apoderado.nombres,
              apaterno: apoderado.apellidoPaterno,
              amaterno: apoderado.apellidoMaterno,
              genero: apoderado.sexo,
              correo: apoderado.correo,
              telefono: apoderado.telefono,
              direccion: apoderado.direccion,
              tipodocumento: {
                idTipoDocumento: apoderado.tipoDocumento
              } as Tipodocumento,
              ubigeo: {
                idUbigeo: apoderado.distrito
              } as Ubigeo,
              fnacimiento: apoderado.fechaNacimiento
            }
          } as Apoderado,
          tiporelacion: {
            idTiporelacion: participanteView.tipoRelacionApoderado
          } as Tiporelacion
        } as Apoderadoparticipante
      } as Inscripcion;
    });

    this.inscripcionService.saveAll(inscripciones).subscribe({
      next: (data) => {
        this.inscripcionService.findAllbyId(data.map(d => d.idInscripcion!)).subscribe({
          next: (data) => {
            this.fichasInscripcion = data.map<FichaView>((e) => {
              return {
                idInscripcion: e.idInscripcion,
                codigo: `${e.idInscripcion}`.padStart(6, '0'),
                nombres: e.apoderadoparticipante.participante.persona.nombres,
                apellidoPaterno: e.apoderadoparticipante.participante.persona.apaterno,
                apellidoMaterno: e.apoderadoparticipante.participante.persona.apaterno,
                domicilio: e.apoderadoparticipante.apoderado.persona.direccion,
                fechaNacimiento: this.formatearFecha(e.apoderadoparticipante.participante.persona.fnacimiento),
                documento: e.apoderadoparticipante.participante.persona.numDocumento,
                edad: this.calcularEdad(e.apoderadoparticipante.participante.persona.fnacimiento),
                disciplina: e.listahorario.horario?.listadisciplina?.disciplina.descripcion ?? '',
                etapa: e.listahorario.horario?.nivel?.descripcion ?? '',
                sede: e.listahorario.horario?.listadisciplina?.sede.ubicacion ?? '',
                complejo: e.listahorario.horario?.listadisciplina?.sede.nombre ?? '',
                horario: (e.listahorario.horario?.turno.listadia?.map(ld => ld.dias?.descripcion?.toUpperCase().slice(0, 3)).join(' - ') ?? '') + `de ${e.listahorario.horario?.turno.horainicio?.slice(0, 5)} a ${e.listahorario.horario?.turno.horafin?.slice(0, 5)}`
              } as FichaView
            });
            console.log("inscripción exitosa");
            console.log('Modales a mostrar:', this.modalesInformativos.length);

            data.forEach(d => {
              this.inscripcionService.notificarCorreo(d.idInscripcion!).subscribe(d => { console.log(d) });
            });

            // Primero mostrar la confirmación
            this.mostrarConfirmacion = true;

            // Luego mostrar el primer modal después de un pequeño delay
            setTimeout(() => {
              this.indiceModalActual = 0;
              this.mostrarSiguienteModal();
            }, 500);
          },
          error: (error) => {
            console.log(error);
            // this.modalService.error(`Error al obtener las inscripciones:${error.message}`);
          }
        });
      },
      error: (error) => {
        console.log(error);
        // this.modalService.error(`Error en la inscripcón:${error.message}`);
      }
    });
  }

  mostrarSiguienteModal(): void {
    console.log("Mostrando modal índice:", this.indiceModalActual, "de", this.modalesInformativos.length);

    if (this.indiceModalActual < this.modalesInformativos.length) {
      this.modalInformativoActual = this.modalesInformativos[this.indiceModalActual];
      this.mostrarModalInformativo = true;
      console.log("Modal mostrado para:", this.modalInformativoActual.participante.nombres);
    } else {
      // Ya no hay más modales, simplemente cerrar
      this.mostrarModalInformativo = false;
      console.log("Ya no hay más modales");
    }
  }

  cerrarModalInformativo(): void {
    console.log("Cerrando modal índice:", this.indiceModalActual);
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
  generarFichaPreinscripcion(ficha: FichaView): void {
    // console.log('Generando Ficha de Pre-inscripción para:', `${ficha.nombres} `);
    // TODO: Implementar generación de PDF
    // alert(`Generando Ficha de Pre-inscripción para ${participante.nombres} ${participante.apellidoPaterno}...`);
    this.inscripcionService.generarFichaPreInscripcion(ficha.idInscripcion).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'ficha-inscripcion.pdf'; // nombre del archivo
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        alert(`Error al descargar: ${err}`);
      }
    });
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
    if (!fecha) return "";
    const d = new Date(fecha);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const anio = d.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  // ==================== DOCUMENTOS (LEGACY) ====================

  onFileSelect(event: any, tipo: string): void {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Solo se permiten archivos PDF, JPG o PNG");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo no debe superar los 5MB");
        return;
      }

      this.archivosSubidos[tipo] = file;
    }
  }

  getNombreArchivo(tipo: string): string {
    return this.archivosSubidos[tipo]?.name || "Ningún archivo seleccionado";
  }

  // ==================== UTILIDADES ====================

  soloLetras(event: KeyboardEvent): boolean {
    const char = String.fromCharCode(event.keyCode);
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(char);
  }

  soloNumerosApoderado(event: KeyboardEvent): boolean {
    if (this.apoderadoForm.get("tipoDocumento")?.value === 1) {
      const char = String.fromCharCode(event.keyCode);
      return /^[0-9]+$/.test(char);
    }
    return true;
  }

  soloNumerosAlumno(event: KeyboardEvent): boolean {
    if (this.alumnoForm.get("tipoDocumento")?.value === 1) {
      const char = String.fromCharCode(event.keyCode);
      return /^[0-9]+$/.test(char);
    }
    return true;
  }

  resetFormularios(): void {
    this.apoderadoForm.reset({ tipoDocumento: 1, tipoApoderado: 1 });
    this.alumnoForm.reset({ tipoDocumento: 1, tieneDiscapacidad: false });
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

  changeTipodocApoderado() {
    const tipo = Number(this.apoderadoForm.get("tipoDocumento")?.value);

    if (tipo === 1) {
      // DNI: exactamente 8 dígitos numéricos
      this.apoderadoForm
        .get("numeroDocumento")
        ?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^\d{8}$/)]);
      this.msgErrorNroDocApoderado = "Debe ingresar 8 dígitos";
    } else if (tipo === 2) {
      // Carnet de Extranjería: 12 caracteres alfanuméricos
      this.apoderadoForm.get("numeroDocumento")?.setValidators([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(20), // Por si acaso hay formatos con dígitos adicionales
        Validators.pattern(/^[A-Z0-9]+$/i), // Alfanumérico
      ]);
      this.msgErrorNroDocApoderado = "Debe ingresar entre 9 y 20 digitos";
    }

    // Importante: actualizar el estado de validación
    this.apoderadoForm.get("numeroDocumento")?.updateValueAndValidity();
  }

  changeTipodocAlumno() {
    const tipo = Number(this.alumnoForm.get("tipoDocumento")?.value);

    if (tipo === 1) {
      // DNI: exactamente 8 dígitos numéricos
      this.alumnoForm
        .get("numeroDocumento")
        ?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^\d{8}$/)]);
      this.msgErrorNroDocAlumno = "Debe ingresar 8 dígitos";
    } else if (tipo === 2) {
      // Carnet de Extranjería: 12 caracteres alfanuméricos
      this.alumnoForm.get("numeroDocumento")?.setValidators([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(20), // Por si acaso hay formatos con dígitos adicionales
        Validators.pattern(/^[A-Z0-9]+$/i), // Alfanumérico
      ]);
      this.msgErrorNroDocAlumno = "Debe ingresar entre 9 y 20 digitos";
    }

    // Importante: actualizar el estado de validación
    this.alumnoForm.get("numeroDocumento")?.updateValueAndValidity();
  }

  disabledSearchButtonApoderado() {
    const tipoDoc = Number(this.apoderadoForm.get("tipoDocumento")?.value);
    const numDoc = this.apoderadoForm.get("numeroDocumento")?.value;
    return this.cargandoApoderado || (tipoDoc == 1 && numDoc?.length !== 8) || (tipoDoc == 2 && (numDoc.length < 9 || numDoc.length > 20));
  }

  disabledSearchButtonAlumno() {
    const tipoDoc = Number(this.alumnoForm.get("tipoDocumento")?.value);
    const numDoc = this.alumnoForm.get("numeroDocumento")?.value;
    return this.cargandoAlumno || (tipoDoc == 1 && numDoc?.length !== 8) || (tipoDoc == 2 && (numDoc.length < 9 || numDoc.length > 20));
  }

  onStepChange(event: any){
    console.log('stepper cambiado');
    this.alumnoForm.markAsUntouched({emitEvent: true});
    this.alumnoForm.markAsPristine({emitEvent: true});
  }
}
