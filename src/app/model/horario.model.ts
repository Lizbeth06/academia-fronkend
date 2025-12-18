export interface Horario {
  idHorario?: number;
  contador: number;
  numVacante: number;
  limitePreinscripcion: number;
  usuariocrea?: string;
  fechacreada?: string | null;
  usuariomodifica?: string | null;
  fechamodificada?: string | null;
  estado: string;
  turno: Turno;
  listadisciplina: Listadisciplina;
  temporada: Temporada;
  modalidad: Modalidad;
  categoriaedad: Categoriaedad;
  nivel: Nivel;
}

export interface Categoriaedad {
  idCategoriaedad: number;
  descripcion?: string;
  edadminima?: number;
  edadmaxima?: number;
  estado?: string;
}

export interface Modalidad {
  idModalidad: number;
  descripcion?: string;
}

export interface Nivel {
  idNivel?: number;
  codigo?: string;
  descripcion?: string;
}

export interface Listadisciplina {
  idListadisciplina?: number;
  estado: string;
  sede: Sede;
  disciplina: Disciplina;
}

export interface Disciplina {
  idDisciplina: number;
  codigo?: string;
  descripcion?: string;
  edadDeporte?: string;
  edadParadeporte?: string;
  estado?: boolean;
  fregistro?: Date;
}

export interface Sede {
  idSede: number;
  nombre?: string;
  codubi?: number;
  direccion?: string;
  capacidad?: number;
  ubicacion?: string;
  latitud?: number;
  longitud?: number;
  estado?: number;
  sector?: Sector;
}

export interface Sector {
  idSector: number;
  descripcion: string;
}

export interface Temporada {
  idTemporada: number;
  descripcion?: string;
  faperturainscripcion?: Date;
  finicioclases?: Date;
  fcierreclases?: Date;
  fcierreinscripcion?: Date;
  fregistro?: Date;
  estado?: string;
  anio?: Anio;
}

export interface Anio {
  idAnio: number;
  descripcion: string;
}

export interface Turno {
  idTurno: number;
  horainicio?: string;
  horafin?: string;
  estado?: string;
  tipoturno?: Tipoturno;
  listadia?: Listadia[];
}

export interface Listadia {
  idListadia?: number;
  estado?: string;
  turno?: string;
  dias?: Dias;
}

export interface Dias {
  idDias?: number;
  codigo?: string;
  descripcion?: string;
}

export interface Tipoturno {
  idTipoturno?: number;
  abreviatura?: string;
  descripcion?: string;
}
