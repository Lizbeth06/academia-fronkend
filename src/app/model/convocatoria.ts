import { Oficina } from "./oficina";
import { TipoInvolucrado } from "./tipoinvolucrado";
import { Usuario } from "./usuario";

export interface Convocatoria{
    idConvocatoria: number;
    titulo: string;
    subtitulo: string;
    descripcion: string;
    finicioinscripcion: Date;
    ffinalinscripcion: Date;
    finicioactividad: Date;
    ffinactividad: Date;
    numvacantes: number;
    numinscritos: number;
    fcreada: Date;
    fmodificada?:Date;
    urlImagen: string;
    estado: number;
    usuariocrea: Usuario;
    usuariomodifica: Usuario;
}