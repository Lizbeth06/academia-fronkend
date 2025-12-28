import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Observable, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Apoderadoparticipante } from "../model/apoderadoparticipante.model";

@Injectable({
  providedIn: "root",
})
export class ApoderadoparticipanteService extends GenericService<Apoderadoparticipante> {
  private apoderadoparticipanteChange: Subject<Apoderadoparticipante[]> = new Subject<Apoderadoparticipante[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/apoderadoparticipante`);
  }

  findByDocumento(
    idTipoDocApoderado: number,
    numDocApoderado: string,
    idTipoDocParticipante: number,
    numDocParticipante: string
  ): Observable<Apoderadoparticipante> {
    const params = new HttpParams()
      .set("idTipoDocApoderado", idTipoDocApoderado)
      .set('numDocApoderado', numDocApoderado)
      .set("idTipoDocParticipante", idTipoDocParticipante)
      .set('numDocParticipante', numDocParticipante);
    return this.http.get<Apoderadoparticipante>(`${this.url}/tipo-numero-documento`, { params });
  }

  setApoderadoparticipanteChange(data: Apoderadoparticipante[]) {
    this.apoderadoparticipanteChange.next(data);
  }

  getApoderadoparticipanteChange() {
    return this.apoderadoparticipanteChange.asObservable();
  }
}
