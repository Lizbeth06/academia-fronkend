import { Menu } from "./menu";
import { Menugrupo } from "./menugrupo";


export interface MenuAgrupado {
  grupo: Menugrupo;
  items: Menu[];
}