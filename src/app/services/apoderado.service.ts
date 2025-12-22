import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Observable, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Apoderado } from "../model/apoderado.model";

@Injectable({
  providedIn: "root",
})
export class ApoderadoService extends GenericService<Apoderado> {
  private apoderadoChange: Subject<Apoderado[]> = new Subject<Apoderado[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/apoderado`);
  }

  findByDocumento(idTipodocumento: number, numDocumento: string): Observable<Apoderado> {
    const params = new HttpParams()
      .set("idTipodocumento", idTipodocumento)
      .set('numDocumento', numDocumento);
    return this.http.get<Apoderado>(`${this.url}/documento`, { params });
  }

  setApoderadoChange(data: Apoderado[]) {
    this.apoderadoChange.next(data);
  }

  getApoderadoChange() {
    return this.apoderadoChange.asObservable();
  }
}
