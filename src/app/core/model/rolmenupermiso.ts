import { Menu } from "./menu";
import { Permiso } from "./permiso.model";

export interface Rolmenupermiso {
  idRolmenupermiso: number;
  estado: string;
  menu: Menu;
  permiso: Permiso;
}
