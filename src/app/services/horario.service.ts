import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Horario } from "../model/horario.model";
import { TokenService } from "./token.service";
import { ListaAgrupada } from "../model/listaagrupadahorario.model";
@Injectable({
  providedIn: "root",
})
export class HorarioService extends GenericService<Horario> {
  private horarioChange: Subject<Horario[]> = new Subject<Horario[]>();

  constructor(protected override http: HttpClient, private tokenService: TokenService) {
    super(http, `${environment.HOST}/api/horario`);
  }

  urlApi = `${environment.HOST}/api/horario`;

  crearHorarios(data: Horario[]) {
    const token: string = this.tokenService.getToken() ?? "";
    return this.http.post<Horario[]>(`${this.urlApi}/guardar/lote`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getHorarioagrupado(idSede: Number) {
    return this.http.get<ListaAgrupada[]>(`${environment.HOST}/api/horario/listagrupada/${idSede}`);
  }

  getHorarioxsede(idSede: Number) {
    return this.http.get<Horario[]>(`${environment.HOST}/api/horario/horariosxsede/${idSede}`);
  }

  setHorarioChange(data: Horario[]) {
    this.horarioChange.next(data);
  }

  getHorarioChange() {
    return this.horarioChange.asObservable();
  }
}
