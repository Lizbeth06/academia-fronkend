import { Tipodocumento } from "./tipodocumento";
import { Ubigeo } from "./ubigeo.model";

export interface Apoderado {
  idApoderado?: number;
  numDocumento: string;
  nombres: string;
  apaterno: string;
  amaterno: string;
  genero: number;
  correo: string;
  telefono: string;
  direccion: string;
  fNacimiento: Date;
  tipodocumento: Tipodocumento;
  ubigeo: Ubigeo;
}
