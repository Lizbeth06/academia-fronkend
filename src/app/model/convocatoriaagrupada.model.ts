import { Convocatoria } from "./convocatoria";
import { Horario } from "./horario.model";

export interface ConvocatoriaAgrupada {
  convocatoria: Convocatoria;
  listaHorarios: ListaHorario[];
}
export interface ListaHorario {
  idListahorario: number;
  intervaloHora: string;
  turno: string;
  estado: string;
  horario: Horario;
}
