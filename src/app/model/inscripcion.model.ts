import { Apoderadoparticipante } from "./apoderadoparticipante.model";
import { Listahorario } from "./listahorario";
import { Tiposeguro } from "./tiposeguro.model";

export interface Inscripcion {
  idInscripcion?: number;
  finscripcion: Date;
  observacion: string;
  listahorario: Listahorario;
  numRegistro: string;
  estado: string;
  tiposeguro: Tiposeguro;
  tipoinscripcion: Tipoinscripcion;
  apoderadoparticipante: Apoderadoparticipante;
}

export interface Tipoinscripcion {
  idTipoinscripcion: number;
  descripcion: string;
}
