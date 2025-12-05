import { Menugrupo } from "./menugrupo";

export interface Menu {
    idMenu: number,
    icono: string,
    nombreMenu: string,
    urlMenu: string,
    menugrupo: Menugrupo;
}
