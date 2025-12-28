import { Convocatoria } from "./convocatoria";
import { Horario } from "./horario.model";

export interface Listahorario{
    idListahorario: number,
    intervaloHora: string,
    turno: string,
    estado: string,
    convocatoria: Convocatoria,
    horario: Horario
}