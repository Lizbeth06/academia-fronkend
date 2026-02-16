import { Menugrupo } from "./menugrupo";

export interface Menu {
  idMenu: number;
  nombre: string;
  codigo: string;
  icono: string;
  urlMenu: null;
  menupadre: null;
  orden: string;
  estado: string;
  fechacreada: Date;
  usuariocrea: string;
  fechamodificada: null;
  usuariomodifica: null;
}

export interface MenuSubmenu {
  idMenu: number;
  nombre: string;
  codigo: string;
  icono: string;
  urlMenu: null;
  menupadre: null;
  orden: string;
  estado: string;
  fechacreada: Date;
  usuariocrea: string;
  fechamodificada: null;
  usuariomodifica: null;
  children?: Menu[];
}

export interface MenuOption {
  href: string;
  icono: string;
  nombre: string;
}
