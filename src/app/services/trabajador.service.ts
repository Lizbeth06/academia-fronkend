import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Trabajador } from '../model/trabajador';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService extends GenericService<Trabajador> {
  private trabajadorChange: Subject<Trabajador[]> = new Subject<Trabajador[]>
  private messageChange: Subject<string> = new Subject<string>;

  constructor(
    protected override http: HttpClient,
  ) {
    super(
      http,
      `${environment.HOST}/api/trabajador`
    );
  }

  findByDocumento(idTipodocumento: number, numDocumento: string): Observable<Trabajador> {
    const params = new HttpParams()
      .set("idTipodocumento", idTipodocumento)
      .set('numDocumento', numDocumento);
    return this.http.get<Trabajador>(`${this.url}/documento`, { params });
  }

  setTrabajadorChange(data: Trabajador[]) {
    this.trabajadorChange.next(data);
  }

  getTrabajadorChange() {
    return this.trabajadorChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

}

