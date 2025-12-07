import { Tipoturno } from "./tipoturno.model";

export interface Turno {
    idTurno?:    number;
    horainicio: string;
    horafin:    string;
    estado:     string;
    tipoturno:  Tipoturno;
}
