export interface Convocatoria {
  idConvocatoria: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  fechacreada?: string;
  usuariocrea?: string;
  fechamodificada?: string;
  usuariomodifica?: string;
  urlImagen?: string;
  estado: string;
  temporada: Temporada;
}

export interface Temporada {
  idTemporada: number;
  descripcion?: string;
  faperturainscripcion?: string;
  finicioclases?: string;
  fcierreclases?: string;
  fcierreinscripcion?: string;
  fregistro?: string;
  estado?: string;
  anio?: Anio;
}

export interface Anio {
  idAnio: number;
  descripcion?: string;
}
