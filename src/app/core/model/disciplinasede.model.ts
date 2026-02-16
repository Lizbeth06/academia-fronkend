export interface DisciplinaSede {
  convocatoria: Convocatoria;
  disciplina: Disciplina;
  sede: Sede;
  horario: Horario[];
}

interface Convocatoria {
  idConvocatoria: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  fechacreada: string;
  usuariocrea: string;
  fechamodificada: string;
  usuariomodifica: string;
  urlImagen: string;
  estado: string;
  temporada: Temporada;
}

interface Temporada {
  idTemporada: number;
  descripcion: string;
  faperturainscripcion: string;
  finicioclases: string;
  fcierreclases: string;
  fcierreinscripcion: string;
  fregistro: string;
  estado: string;
  anio: Anio;
}
interface Anio {
  idAnio: number;
  descripcion: string;
}

interface Disciplina {
  idDisciplina: number;
  codigo: string;
  descripcion: string;
  edadDeporte: string;
  edadParadeporte: string;
  definicion: string;
  estado: string;
  fregistro: string;
}

export interface Horario {
  idHorario: number;
  contador: number;
  numVacante: number;
  limitePreinscripcion: number;
  usuariocrea: string;
  fechacreada: string;
  usuariomodifica: string;
  fechamodificada: string;
  estado: string;
  turno: Turno;
  modalidad: Modalidad;
  categoriaedad: Categoriaedad;
  nivel: Nivel;
}

interface Categoriaedad {
  idCategoriaedad: number;
  descripcion: string;
  edadminima: number;
  edadmaxima: number;
  estado: string;
}

interface Modalidad {
  idModalidad: number;
  descripcion: string;
}

interface Nivel {
  idNivel: number;
  codigo: string;
  descripcion: string;
}

interface Turno {
  idTurno: number;
  horainicio: string;
  horafin: string;
  estado: string;
  tipoturno: Tipoturno;
  listadia: Listadia[];
}

interface Listadia {
  idListadia: number;
  estado: string;
  dias: Dias;
}

interface Dias {
  idDias: number;
  codigo: string;
  descripcion: string;
}

interface Tipoturno {
  idTipoturno: number;
  abreviatura: string;
  descripcion: string;
}

interface Sede {
  idSede: number;
  nombre: string;
  codubi: number;
  direccion: string;
  capacidad: number;
  ubicacion: string;
  latitud: number;
  longitud: number;
  estado: number;
  sector: Sector;
}

interface Sector {
  idSector: number;
  descripcion: string;
}
