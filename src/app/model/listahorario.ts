import { Convocatoria } from "./convocatoria";
import { Horario } from "./horario.model";

export interface Listahorario{
    idListahorario: number,
    convocatoria: Convocatoria,
    horario: Horario
}