import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { ListarHorConv } from "../model/Listarlistadohorario.model";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Listahorariobloque } from "../model/listahorario.model";
import { Listahorario } from "../model/listahorario";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: "root",
})
export class ListahorarioService extends GenericService<ListarHorConv> {
  private listahorarioChange: Subject<ListarHorConv[]> = new Subject<ListarHorConv[]>();

  private apiUrl: string = `${environment.HOST}/api/listahorario`;
  constructor(protected override http: HttpClient, private tokenService: TokenService) {
    super(http, `${environment.HOST}/api/listahorario`);
  }

  urlApi = `${environment.HOST}/api/listahorario`;
  crearConvocatoria(data: Listahorariobloque) {
    const token: string = this.tokenService.getToken() ?? "";
    return this.http.post<Listahorariobloque>(`${this.urlApi}/crear-bloque`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  actualizarConvocatoria(idConvocatoria: number, data: Listahorariobloque) {
    const token: string = this.tokenService.getToken() ?? "";
    return this.http.put<Listahorariobloque>(`${this.urlApi}/actualizar-bloque/${idConvocatoria}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  eliminarConvocatoria(idEliminar: number) {
    const token: string = this.tokenService.getToken() ?? "";
    return this.http.delete<Listahorariobloque>(`${this.urlApi}/eliminar/${idEliminar}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  findDisponibles(edad: number, idModalidad: number, idSede: number) {
    const params = new HttpParams();
    params.set("edad", edad);
    params.set("idModalidad", idModalidad);
    params.set("idSede", idSede);
    return this.http.get<Listahorario[]>(`${this.url}/disponibles`, { params });
  }
  setListahorarioChange(data: ListarHorConv[]) {
    this.listahorarioChange.next(data);
  }

  getListahorarioChange() {
    return this.listahorarioChange.asObservable();
  }
}
