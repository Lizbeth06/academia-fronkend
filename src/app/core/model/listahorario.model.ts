export interface Listahorariobloque {
  convocatoria: Convocatoria;
  listaHorarios: ListaHorario[];
}

export interface Convocatoria {
  idConvocatoria?: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  fechacreada?: string;
  usuariocrea?: string;
  fechamodificada?: string;
  usuariomodifica?: string;
  urlImagen: string;
  estado: string;
  temporada: Temporada;
}

export interface Temporada {
  idTemporada: number;
}

export interface ListaHorario {
  idListahorario?: number;
  intervaloHora: string;
  turno: string;
  estado: string;
  horario: Horario;
}

export interface Horario {
  idHorario: number;
}
