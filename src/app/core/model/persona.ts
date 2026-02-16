import { Genero } from "./genero.model";
import { Tipodocumento } from "./tipodocumento";
import { Ubigeo } from "./ubigeo.model";

export class Persona {
  idPersona: number;
  numDocumento: string;
  nombres: string;
  apaterno: string;
  amaterno: string;
  correo: string;
  telefono: string;
  direccion: string;
  urllinkeding: string;
  fnacimiento: Date;
  urlFoto: string;
  genero: Genero;
  tipodocumento: Tipodocumento;
  ubigeo: Ubigeo;
}
