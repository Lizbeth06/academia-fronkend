export interface ApiDniResponse{
  status: string,
  code: number,
  mensaje: string,
  personal: {
    apPrimer: string,
    apSegundo: string,
    prenombres: string,
    restriccion: string
  }
}