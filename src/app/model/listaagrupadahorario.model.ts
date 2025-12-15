import { Horario } from "./horario.model";

export interface ListaAgrupada {
  idDisciplina: number;
  nombreDisciplina: string;
  horarios: Horario[];
}
