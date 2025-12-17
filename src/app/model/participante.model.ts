import { Tipodocumento } from "./tipodocumento";
import { Tiposeguro } from "./tiposeguro.model";

export interface Participante{
    idParticipante: number;
    numDocumento: string;
    nombres: string;
    apaterno: string;
    amaterno: string;
    genero: number;
    fNacimiento: Date;
    presentaDiscapacidad: boolean;
    tipodocumento: Tipodocumento;
    tiposeguro: Tiposeguro
}