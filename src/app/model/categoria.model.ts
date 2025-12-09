export interface Categoria {
  idCategoriaedad?: number;
  descripcion: string;
  edadminima: number;
  edadmaxima: number;
  estado: string;
  criterioparticipacion: Criterioparticipacion;
}

export interface Criterioparticipacion {
  idCriterioparticipacion: number;
  descripcion?: string;
}
