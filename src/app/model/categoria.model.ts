export interface Categoria {
  idCategoriaedad?: number;
  descripcion: string;
  edadminima: number;
  edadmaxima: number;
  estado: string;
  etapa: string;
  criterioparticipacion: Criterioparticipacion;
}

export interface Criterioparticipacion {
  idCriterioparticipacion: number;
  descripcion?: string;
}
