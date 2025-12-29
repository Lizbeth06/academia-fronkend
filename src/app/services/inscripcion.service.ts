import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Observable, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Inscripcion } from '../model/inscripcion';

@Injectable({
  providedIn: "root",
})
export class InscripcionService extends GenericService<Inscripcion> {
  private inscripcionChange: Subject<Inscripcion[]> = new Subject<Inscripcion[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/inscripcion`);
  }

  saveAll(list: Inscripcion[]) {
    return this.http.post<Inscripcion[]>(`${environment.HOST}/api/inscripcion/multiples`, list);
  }

  findAllbyId(ids: number[]) {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.get<Inscripcion[]>(`${environment.HOST}/api/inscripcion/multiples`, { params });
  }

  generarFichaPreInscripcion(idInscripcion: number): Observable<Blob> {
    return this.http.get(`${this.url}/${idInscripcion}/ficha-preinscripcion`, {
      responseType: 'blob'
    });
  }

  generarDeclaracionJurada(idInscripcion: number): Observable<Blob> {
    return this.http.get(`${this.url}/${idInscripcion}/declaracion-jurada`, {
      responseType: 'blob'
    });
  }

  notificarCorreo(idInscripcion: number){
    return this.http.post(`${this.url}/${idInscripcion}/notificacion-correo`,null);
  }

  setInscripcionChange(data: Inscripcion[]) {
    this.inscripcionChange.next(data);
  }

  getInscripcionChange() {
    return this.inscripcionChange.asObservable();
  }
}
