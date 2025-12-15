import { Dias } from "./dias.model";
import { Tipoturno } from "./tipoturno.model";

export interface Turno {
  idTurno?: number;
  horainicio: string;
  horafin: string;
  estado: string;
  tipoturno: Tipoturno;
  listadia: Listadia[];
}

export interface Listadia {
  idListadia?: number;
  estado: string;
  turno?: string;
  dias: Dias;
}
