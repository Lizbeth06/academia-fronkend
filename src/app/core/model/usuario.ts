import { Persona } from "./persona";
import { UsuarioRol } from "./usuario-rol";

export class Usuario {
  idUsuario: number;
  nombreUsuario: string;
  username: string;
  password: string;
  estado: string;
  numIntento: number;
  cambioPassword: boolean;
  fechacreada: Date;
  usuariocrea: string;
  fechamodificada: null;
  usuariomodifica: null;
  persona: Persona;
  usuariorol: UsuarioRol[];
}
