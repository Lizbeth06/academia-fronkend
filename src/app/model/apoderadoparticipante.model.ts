import { Tiporelacion } from "./tiporelacion.model";

export interface Apoderadoparticipante {
    idApoderadoparticipante: number;
    idApoderado: number;
    idParticipante: number;
    tiporelacion: Tiporelacion;
}