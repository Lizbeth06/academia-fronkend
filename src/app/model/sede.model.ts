export interface Sede {
  idSede: number;
  nombre: string;
  codubi: number;
  direccion: string;
  capacidad: number;
  ubicacion: string;
  latitud: number;
  longitud: number;
  estado: number;
  sector: Sector;
}

export interface Sector {
  idSector: number;
  descripcion: string;
}
