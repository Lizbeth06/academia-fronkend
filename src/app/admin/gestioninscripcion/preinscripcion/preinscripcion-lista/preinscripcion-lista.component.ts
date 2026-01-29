import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { Tipodocumento } from "../../../../model/tipodocumento";
import { TipodocumentoService } from "../../../../services/tipodocumento.service";
import { UbigeoService } from "../../../../services/ubigeo.service";
import { Ubigeo } from "../../../../model/ubigeo.model";
import { Tiposeguro } from "../../../../model/tiposeguro.model";
import { TiposeguroService } from "../../../../services/tiposeguro.service";
import { Sede } from "../../../../model/sede.model";
import { SedeService } from "../../../../services/sede.service";
import { ApiExternoService } from "../../../../services/api-externo.service";
import { ApiDniResponse } from "../../../../model/apiDniResponse.model";
import { DocumentConfig } from "../../../../util/tipodocumentoConfig.util";
import { DisciplinaService } from "../../../../services/disciplina.service";
import { ApoderadoService } from "../../../../services/apoderado.service";
import { ParticipanteService } from "../../../../services/participante.service";
import { Participante } from "../../../../model/participante.model";
import { TiporelacionService } from "../../../../services/tiporelacion.service";
import { Tiporelacion } from "../../../../model/tiporelacion.model";
import { ListahorarioService } from "../../../../services/listahorario.service";
import { InscripcionService } from "../../../../services/inscripcion.service";
import { Listahorario } from "../../../../model/listahorario";
import { Apoderado } from "../../../../model/apoderado.model";
import { ModalService } from "../../../../util/modal.service";
import { Apoderadoparticipante } from "../../../../model/apoderadoparticipante.model";
import { ApoderadoparticipanteService } from "../../../../services/apoderadoparticipante.service";
import { Persona } from "../../../../model/persona";
import { Inscripcion, Tipoinscripcion } from "../../../../model/inscripcion.model";
import { MaterialModule } from "../../../../material/material.module";
import { calcularEdad } from "../../../../util/calculos.util";
import { validarInput, ValidationType } from "../../../../util/validaciones.util";
import { genero } from "../../../../core/data/genders.data";

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
  modalidad: "digital" | "presencial";
  codigoRegistro: string;
}

export interface HorarioView {
  idHorario: number;
  edad: string;
  etapa: string;
  dias: string;
  horas: string;
  deporte: string;
  numeroPreinscripcionesDisponibles: number;
}

export interface ParticipanteView {
  tipoDocumento: number;
  numeroDocumento: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  fechaNacimiento: Date;
  sexo: string;
  tipoRelacionApoderado: number;
  tipoSeguro: number;
  tieneDiscapacidad: boolean;
}

export interface FichaView {
  idInscripcion: number;
  codigo: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  domicilio: string;
  fechaNacimiento: string;
  documento: string;
  edad: number;
  disciplina: string;
  etapa: string;
  sede: string;
  complejo: string;
  horario: string;
}

@Component({
  selector: "app-pre-inscripcion",
  standalone: true,
  imports: [MaterialModule],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "es-PE" },
  ],
  templateUrl: "./preinscripcion-lista.component.html",
  styleUrl: "./preinscripcion-lista.component.css",
})
export class PreInscripcionComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
  ) {}

  mapaUrlSanitizada!: SafeResourceUrl;
  generos = genero;
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

  // Opciones para los dropdowns
  tiposDocumento: Tipodocumento[] = [];
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

  ngOnInit(): void {
    this.inicializarFormularios();
    this.cargarDatosIniciales();
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
      numeroDocumento: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^\d{8}$/)]],
      apellidoPaterno: ["", Validators.required],
      apellidoMaterno: ["", Validators.required],
      nombres: ["", Validators.required],
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
      this.tiposDocumento = data.filter((td) => td.idTipoDocumento < 3);
    });

    //Departamentos
    this.ubigeoService.getAllDepartments().subscribe((data) => {
      this.departamentos = data;
      this.departamentosSede = data;
    });

    //Tipos de seguro
    this.tiposeguroService.findAll().subscribe((data) => {
      this.tiposSeguro = data;
    });

    //Tipos de relacion con el apoderado
    this.tiporelacionService.findAll().subscribe((data) => {
      this.tiposRelacionApoderado = data;
    });
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
        this.apoderadoForm.patchValue({
          apellidoPaterno: data.persona.apaterno.toUpperCase().trim(),
          apellidoMaterno: data.persona.amaterno.toUpperCase().trim(),
          nombres: data.persona.nombres.toUpperCase().trim(),
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
  }

  onDepartamentoChange(): void {
    const depId = this.apoderadoForm.get("departamento")?.value;
    // this.provincias = [];
    this.ubigeoService.findProvincias(depId).subscribe((data) => {
      this.provincias = data;
    });
    this.distritos = [];
    this.apoderadoForm.patchValue({ provincia: "", distrito: "" });
  }

  onProvinciaChange(): void {
    const depId = this.apoderadoForm.get("departamento")?.value;
    const provId = this.apoderadoForm.get("provincia")?.value;
    this.ubigeoService.findDistritos(depId, provId).subscribe((data) => {
      this.distritos = data;
    });
    this.apoderadoForm.patchValue({ distrito: "" });
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
            tieneDiscapacidad: data.presentaDiscapacidad,
          });
          //TODO: Encontrar la relacion entre apoderado y alumno
          const idTipoDocApoderado = this.apoderadoForm.get("tipoDocumento")?.value;
          const numDocumentoApoderado = this.apoderadoForm.get("numeroDocumento")?.value;
          const idTipoDocAlumno = this.alumnoForm.get("tipoDocumento")?.value;
          const numDocumentoAlumno = this.alumnoForm.get("numeroDocumento")?.value;
          this.apoderadoparticipanteService
            .findByDocumento(idTipoDocApoderado, numDocumentoApoderado, idTipoDocAlumno, numDocumentoAlumno)
            .subscribe({
              next: (data) => {
                this.alumnoForm.patchValue({
                  tipoRelacionApoderado: data.tiporelacion.idTiporelacion,
                });
              },
              error: (error) => {
                this.alumnoForm.patchValue({
                  tipoRelacionApoderado: undefined,
                });
              },
            });
          this.cargandoAlumno = false;
        },
        error: (error) => {
          this.cargandoAlumno = false;
        },
      });
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

  agregarParticipante(): void {
    if (this.alumnoForm.valid) {
      const alumnoFormValues = this.alumnoForm.value;
      const nuevoParticipante: ParticipanteView = { ...alumnoFormValues };

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
    this.alumnoForm.markAsUntouched({ emitEvent: true });

    this.tieneDiscapacidad = false;
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
    this.participanteActualIndex = this.participantes.findIndex((p) => p.numeroDocumento === participante.numeroDocumento);

    this.alumnoForm.patchValue({ ...participante });

    this.tieneDiscapacidad = participante.tieneDiscapacidad;

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
        id: this.participantes[this.participanteActualIndex].numeroDocumento,
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
      this.participantes = this.participantes.filter((p) => p.numeroDocumento !== participante.numeroDocumento);

      this.horariosAsignados = this.horariosAsignados.filter((h) => h.participanteId !== participante.numeroDocumento);
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
    }
  }

  //  NUEVO: Generar Declaración Jurada desde formulario (antes de agregar)
  generarDeclaracionJuradaFormulario(ficha: FichaView): void {
    this.inscripcionService.generarDeclaracionJurada(ficha.idInscripcion).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "ficha-inscripcion.pdf"; // nombre del archivo
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        alert(`Error al descargar: ${err}`);
      },
    });
  }

  // NUEVO: Generar Declaración Jurada
  generarDeclaracionJurada(ficha: FichaView): void {
    this.inscripcionService.generarDeclaracionJurada(ficha.idInscripcion).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "declaracion-jurada.pdf"; // nombre del archivo
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        alert(`Error al descargar: ${err}`);
      },
    });
  }

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
  }

  onProvinciaSedeChange(): void {
    const provId = this.sedeDeporteForm.get("provincia")?.value;
    this.ubigeoService.findDistritos(this.sedeDeporteForm.get("departamento")?.value, provId).subscribe((data) => {
      this.distritosSede = data;
    });
    this.complejosDeportivos = [];
    this.deportes.clear();
    this.horarios = [];
    this.sedeDeporteForm.patchValue({ distrito: "", complejoDeportivo: "", deporte: "" });
  }

  onDistritoSedeChange(): void {
    const distId = this.sedeDeporteForm.get("distrito")?.value;
    this.sedeService.findAllByCodubi(distId).subscribe((data) => {
      this.complejosDeportivos = data;
    });
    this.deportes.clear();
    this.horarios = [];
    this.sedeDeporteForm.patchValue({ complejoDeportivo: "", deporte: "" });
  }

  onComplejoDeportivoChange(): void {
    const complejoId = this.sedeDeporteForm.get("complejoDeportivo")?.value;
    this.deportes.clear();
    this.horariosFiltrados = [];
    const participante: ParticipanteView = this.participantes.find((p) => p.numeroDocumento === this.participanteSeleccionadoId)!;
    this.listahorarioService
      .findDisponibles(calcularEdad(participante.fechaNacimiento), participante.tieneDiscapacidad ? 2 : 1, complejoId)
      .subscribe((data) => {
        this.horarios = data.map<HorarioView>((lh) => {
          this.deportes.add(lh.horario.listadisciplina.disciplina.descripcion ?? "");
          return <HorarioView>{
            idHorario: lh.idListahorario,
            edad: lh.horario.categoriaedad.edadminima + " - " + lh.horario.categoriaedad.edadmaxima,
            etapa: lh.horario.nivel?.descripcion ?? "",
            dias: lh.horario.turno.listadia?.map((ld) => ld.dias?.descripcion?.toUpperCase().slice(0, 3)).join(" - ") ?? "",
            horas: lh.horario.turno.horainicio?.slice(0, 5) + " - " + lh.horario.turno.horafin?.slice(0, 5),
            deporte: lh.horario.listadisciplina.disciplina.descripcion ?? "",
            numeroPreinscripcionesDisponibles: lh.horario.limitePreinscripcion - lh.horario.contador,
          };
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

    this.actualizarMapaUrl();
  }

  onDeporteChange(): void {
    const deporte = this.sedeDeporteForm.get("deporte")?.value;
    this.horariosFiltrados = this.horarios.filter((h) => h.deporte === deporte);
    this.horarioSeleccionado = null;
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
    const participante = this.participantes.find((p) => p.numeroDocumento === participanteId);

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
      horario: { ...this.horarioSeleccionado },
    };

    this.horariosAsignados.push(nuevoHorario);

    // Limpiar formulario
    this.limpiarFormularioHorario();

    setTimeout(() => {
      const elemento = document.querySelector(".horarios-agregados");
      elemento?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  yaExisteHorarioAsignado(participanteId: string): boolean {
    return this.horariosAsignados.some((h) => h.participanteId === participanteId);
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
      const participante = this.participantes.find((p) => p.numeroDocumento === horario.participanteId);
    }
  }

  //  NUEVO: Validar que hay horarios asignados
  puedeFinalizarInscripcion(): boolean {
    // Debe haber al menos un participante
    if (this.participantes.length === 0) {
      return false;
    }

    // TODOS los participantes deben tener un horario asignado
    return this.participantes.every((participante) => {
      return this.horariosAsignados.some((horario) => horario.participanteId === participante.numeroDocumento);
    });
  }

  actualizarMapaUrl() {
    if (!this.ubicacionComplejo) return;

    const url = `https://www.google.com/maps?q=${this.ubicacionComplejo.lat},${this.ubicacionComplejo.lng}&output=embed`;

    this.mapaUrlSanitizada = this.sanitizer.bypassSecurityTrustResourceUrl(url);
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

    this.participantes.forEach((participante) => {
      const horario = this.horariosAsignados.find((h) => h.participanteId === participante.numeroDocumento);
      if (horario) {
        const codigoRegistro = this.generarCodigoRegistro();

        this.modalesInformativos.push({
          participante: participante,
          modalidad: "digital",
          codigoRegistro: codigoRegistro,
        });
      }
    });

    const apoderado = this.apoderadoForm.getRawValue();
    const inscripciones: Inscripcion[] = this.participantes.map<Inscripcion>((participanteView) => {
      const horarioViewAsignado = this.horariosAsignados.find((h) => h.participanteId === participanteView.numeroDocumento);
      return {
        finscripcion: new Date(),
        observacion: "",
        listahorario: { idListahorario: horarioViewAsignado?.horario.idHorario } as Listahorario,
        estado: "1",
        numRegistro: String(this.generarCodigoRegistro()),
        tiposeguro: { idTiposeguro: participanteView.tipoSeguro } as Tiposeguro,
        tipoinscripcion: { idTipoinscripcion: 1 } as Tipoinscripcion,
        apoderadoparticipante: {
          participante: {
            persona: {
              numDocumento: participanteView.numeroDocumento,
              nombres: participanteView.nombres.toUpperCase().trim(),
              apaterno: participanteView.apellidoPaterno.toUpperCase().trim(),
              amaterno: participanteView.apellidoMaterno.toUpperCase().trim(),
              genero: participanteView.sexo.trim(),
              fnacimiento: participanteView.fechaNacimiento,
              tipodocumento: {
                idTipoDocumento: participanteView.tipoDocumento,
              } as Tipodocumento,
            } as Persona,
            presentaDiscapacidad: participanteView.tieneDiscapacidad,
          } as Participante,
          apoderado: {
            persona: {
              numDocumento: apoderado.numeroDocumento,
              nombres: apoderado.nombres.toUpperCase().trim(),
              apaterno: apoderado.apellidoPaterno.toUpperCase().trim(),
              amaterno: apoderado.apellidoMaterno.toUpperCase().trim(),
              genero: apoderado.sexo.trim(),
              correo: apoderado.correo.trim(),
              telefono: apoderado.telefono,
              direccion: apoderado.direccion.toLowerCase().trim(),
              tipodocumento: {
                idTipoDocumento: apoderado.tipoDocumento,
              } as Tipodocumento,
              ubigeo: {
                idUbigeo: apoderado.distrito,
              } as Ubigeo,
              fnacimiento: apoderado.fechaNacimiento,
            },
          } as Apoderado,
          tiporelacion: {
            idTiporelacion: participanteView.tipoRelacionApoderado,
          } as Tiporelacion,
        } as Apoderadoparticipante,
      } as Inscripcion;
    });
    console.log(JSON.stringify(inscripciones, null, 2));
    this.inscripcionService.saveAll(inscripciones).subscribe({
      next: (data) => {
        this.inscripcionService.findAllbyId(data.map((d) => d.idInscripcion!)).subscribe({
          next: (data) => {
            this.fichasInscripcion = data.map<FichaView>((e) => {
              return {
                idInscripcion: e.idInscripcion,
                codigo: `${e.idInscripcion}`.padStart(6, "0"),
                nombres: e.apoderadoparticipante.participante.persona.nombres.toUpperCase().trim(),
                apellidoPaterno: e.apoderadoparticipante.participante.persona.apaterno.toUpperCase().trim(),
                apellidoMaterno: e.apoderadoparticipante.participante.persona.amaterno.toUpperCase().trim(),
                domicilio: e.apoderadoparticipante.apoderado.persona.direccion.toLowerCase().trim(),
                fechaNacimiento: this.formatearFecha(e.apoderadoparticipante.participante.persona.fnacimiento),
                documento: e.apoderadoparticipante.participante.persona.numDocumento,
                edad: calcularEdad(e.apoderadoparticipante.participante.persona.fnacimiento),
                disciplina: e.listahorario.horario?.listadisciplina?.disciplina.descripcion ?? "",
                etapa: e.listahorario.horario?.nivel?.descripcion ?? "",
                sede: e.listahorario.horario?.listadisciplina?.sede.ubicacion ?? "",
                complejo: e.listahorario.horario?.listadisciplina?.sede.nombre ?? "",
                horario:
                  (e.listahorario.horario?.turno.listadia?.map((ld) => ld.dias?.descripcion?.toUpperCase().slice(0, 3)).join(" - ") ?? "") +
                  `de ${e.listahorario.horario?.turno.horainicio?.slice(0, 5)} a ${e.listahorario.horario?.turno.horafin?.slice(0, 5)}`,
              } as FichaView;
            });
            console.log("inscripción exitosa");
            console.log("Modales a mostrar:", this.modalesInformativos.length);

            data.forEach((d) => {
              this.inscripcionService.notificarCorreo(d.idInscripcion!).subscribe((d) => {
                console.log(d);
              });
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
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  mostrarSiguienteModal(): void {
    console.log("Mostrando modal índice:", this.indiceModalActual, "de", this.modalesInformativos.length);

    if (this.indiceModalActual < this.modalesInformativos.length) {
      this.modalInformativoActual = this.modalesInformativos[this.indiceModalActual];
      this.mostrarModalInformativo = true;
    } else {
      // Ya no hay más modales, simplemente cerrar
      this.mostrarModalInformativo = false;
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

  obtenerEdad(fechaNacimiento: Date) {
    return calcularEdad(fechaNacimiento);
  }
  //  NUEVO: Generar Ficha de Pre-inscripción
  generarFichaPreinscripcion(ficha: FichaView): void {
    this.inscripcionService.generarFichaPreInscripcion(ficha.idInscripcion).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "ficha-inscripcion.pdf"; // nombre del archivo
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        alert(`Error al descargar: ${err}`);
      },
    });
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

  soloNumeros(event: KeyboardEvent, type: ValidationType) {
    validarInput(event, type);
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

  onStepChange(event: any) {
    console.log("stepper cambiado");
    this.alumnoForm.markAsUntouched({ emitEvent: true });
    this.alumnoForm.markAsPristine({ emitEvent: true });
  }
}
