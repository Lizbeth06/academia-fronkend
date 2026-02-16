import { Rolmenupermiso } from "./rolmenupermiso";

export interface Rol {
  idRol: number;
  nombre: string;
  descripcion: string;
  rolSistema: boolean;
  esAdministrador: boolean;
  estado: string;
  fechacreada: Date;
  usuariocrea: string;
  fechamodificada: null;
  usuariomodifica: null;
  rolmenupermiso: Rolmenupermiso[];
}
