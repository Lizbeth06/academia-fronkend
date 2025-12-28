import { Apoderado } from "./apoderado.model";
import { Apoderadoparticipante } from "./apoderadoparticipante.model";
import { Listahorario } from "./listahorario";
import { Participante } from "./participante.model";
import { Tiposeguro } from "./tiposeguro.model";

export interface Inscripcion{
    idInscripcion?: number;
    finscripcion: Date;
    observacion: string;
    listahorario: Listahorario;
    estado: Estado;
    tiposeguro: Tiposeguro;
    tipoinscripcion: Tipoinscripcion;
    apoderadoparticipante: Apoderadoparticipante;
}

export interface Estado{
    idEstado: number;
    descripcion: string;
}

export interface Tipoinscripcion{
    idTipoinscripcion: number;
    descripcion: string;
}