import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Convocatoria } from "../model/convocatoria";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Observable, of, Subject } from "rxjs";
import { Listahorariobloque } from "../model/listahorario.model";
import { TokenService } from "./token.service";
import { ConvocatoriaAgrupada } from "../model/convocatoriaagrupada.model";
import { DisciplinaSede } from "../model/disciplinasede.model";

@Injectable({
  providedIn: "root",
})
export class ConvocatoriaService extends GenericService<Convocatoria> {
  private convocatoriaChange: Subject<Convocatoria[]> = new Subject<Convocatoria[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient, private tokenService: TokenService) {
    super(http, `${environment.HOST}/api/convocatoria`);
  }
  urlApi = `${environment.HOST}/api/convocatoria`;

  getIdConvocatoria(IdConvocatoria: Number) {
    const token: string = this.tokenService.getToken() ?? "";
    return this.http.get<ConvocatoriaAgrupada>(`${this.urlApi}/${IdConvocatoria}/listaconvocatoria`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  getAllConvocatoria(): Observable<ConvocatoriaAgrupada[]> {
    const token: string = this.tokenService.getToken() ?? "";
    return this.http.get<ConvocatoriaAgrupada[]>(`${this.urlApi}/listaconvocatorias`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getConvocatoriapordisciplina(): Observable<DisciplinaSede[]> {
    const token: string = this.tokenService.getToken() ?? "";
    return this.http.get<DisciplinaSede[]>(`${this.urlApi}/listapordisciplina`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  setConvocatoriaChange(data: Convocatoria[]) {
    this.convocatoriaChange.next(data);
  }

  getConvocatoriaChange() {
    return this.convocatoriaChange.asObservable();
  }
}
