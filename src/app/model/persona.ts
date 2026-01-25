import { Tipodocumento } from "./tipodocumento";
import { Ubigeo } from "./ubigeo.model";

export class Persona {
  idPersona: number;
  numDocumento: string;
  nombres: string;
  apaterno: string;
  amaterno: string;
  genero: number;
  correo: string;
  telefono: string;
  direccion: string;
  urllinkeding: string;
  fnacimiento: Date;
  urlFoto: string;
  tipodocumento: Tipodocumento;
  ubigeo: Ubigeo;
}
