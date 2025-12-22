import { Tipodocumento } from "./tipodocumento";
import { Ubigeo } from "./ubigeo.model";

export interface Institucion {
  idInstitucion?: number;
  numDocumento: string;
  razonSocial: string;
  nombreComercial: string;
  telefono?: string;
  celular: string;
  correo?: string;
  igv?: string;
  direccion?: string;
  urlLogo?: string;
  usuarioSol: string;
  claveSol: string;
  tipodocumento: Tipodocumento;
  ubigeo: Ubigeo;
}
