import { Inscripcion } from "./inscripcion.model";

export interface Validacioninscripcion {
  idValidacioninscripcion: number;
  usuariocrea: string;
  fechacreada: Date;
  usuariomodifica: string;
  fechamodificada: Date;
  estado: string;
  inscripcion: Inscripcion;
}

/*Para guarar en tbl validar inscricpión*/
export interface ValidacioninscripcionSave {
  idValidacioninscripcion?: number;
  usuariocrea: string;
  fechacreada: string;
  usuariomodifica?: string;
  fechamodificada?: string;
  estado: string;
  inscripcion: InscripcionSave;
}

export interface InscripcionSave {
  idInscripcion: number;
}
