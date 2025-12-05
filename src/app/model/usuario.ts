
import { Rol } from "./rol";
import { Trabajador } from "./trabajador";


export class Usuario {
    idUsuario:number;
    fRegistro:Date;
    isActive:number;
    password:string;
    username:string;
    usernombres:string;
    termino1:string;
    termino2:string;
    
    trabajador: Trabajador;
    roles: Rol[] = [];
}
