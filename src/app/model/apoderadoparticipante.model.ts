import { Tiporelacion } from "./tiporelacion.model";
import { Apoderado } from './apoderado.model';
import { Participante } from "./participante.model";

export interface Apoderadoparticipante {
    idApoderadoparticipante?: number;
    apoderado: Apoderado;
    participante: Participante;
    tiporelacion: Tiporelacion;
}