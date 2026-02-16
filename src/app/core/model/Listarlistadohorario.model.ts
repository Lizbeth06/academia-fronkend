import { Convocatoria } from "./convocatoria";
import { Horario } from "./horario.model";

export interface ListarHorConv {
  idListahorario: number;
  intervaloHora: string;
  turno: string;
  estado: string;
  convocatoria: Convocatoria;
  horario: Horario;
}
