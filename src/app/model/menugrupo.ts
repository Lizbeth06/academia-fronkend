
export class Menugrupo {
    idMenugrupo: number;
    descripcion: string;// nombre del grupo por ejemplo: Gestion de Productos, Gestion de Usuarios, Gestion de ventas, etc
    estado: number; // 1: activo, 0: inactivo
    lugarmenu: number; // 1: lateral, 2: superior
    titulo: string; // como por ejemplo se alamacena: ventas, compras, productos, etc
    icono: string;
}