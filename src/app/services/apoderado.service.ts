import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Observable, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Apoderado } from "../model/apoderado.model";
import { Apoderadoparticipante } from "../model/apoderadoparticipante.model";

@Injectable({
  providedIn: "root",
})
export class ApoderadoService extends GenericService<Apoderado> {
  private apoderadoChange: Subject<Apoderado[]> = new Subject<Apoderado[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/apoderado`);
  }

  findByDocumento(idTipodocumento: number, numDocumento: string): Observable<Apoderado> {
    const params = new HttpParams();
    params.set("idTipodocumento", idTipodocumento);
    params.set('numDocumento', numDocumento);
    return this.http.get<Apoderado>(`${this.url}/documento`, { params });
  }

  findRelacionParticipante(idApoderado: number, idParticipante: number): Observable<Apoderadoparticipante>{
    return this.http.get<Apoderadoparticipante>(`${this.url}/${idApoderado}/participante/${idParticipante}`);
  }

  setApoderadoChange(data: Apoderado[]) {
    this.apoderadoChange.next(data);
  }

  getApoderadoChange() {
    return this.apoderadoChange.asObservable();
  }
}
