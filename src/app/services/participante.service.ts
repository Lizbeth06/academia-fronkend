import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Observable, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Participante } from "../model/participante.model";

@Injectable({
  providedIn: "root",
})
export class ParticipanteService extends GenericService<Participante> {
  private participanteChange: Subject<Participante[]> = new Subject<Participante[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/participante`);
  }

  findByDocumento(idTipodocumento: number, numDocumento: string): Observable<Participante> {
    const params = new HttpParams();
    params.set("idTipodocumento", idTipodocumento);
    params.set('numDocumento', numDocumento);
    return this.http.get<Participante>(`${this.url}/documento`, { params });
  }

  setParticipanteChange(data: Participante[]) {
    this.participanteChange.next(data);
  }

  getParticipanteChange() {
    return this.participanteChange.asObservable();
  }
}
