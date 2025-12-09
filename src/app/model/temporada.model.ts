import { Anio } from "./anio.model";

export interface Temporada {
  idTemporada?: number;
  descripcion: string;
  faperturainscripcion: string;
  finicioclases: string;
  fcierreclases: string;
  fcierreinscripcion: string;
  fregistro: string;
  estado: string;
  anio: Anio;
}
