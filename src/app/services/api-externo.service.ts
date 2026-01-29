import { inject, Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { catchError, Observable, Subject, throwError, timeout } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Anio } from "../model/anio.model";
import { Apoderado } from '../model/apoderado.model';
import { ApiDniResponse } from "../model/apiDniResponse.model";

@Injectable({
  providedIn: "root",
})
export class ApiExternoService {
  private http = inject(HttpClient);
  private url = `${environment.HOST}/api/externo`;

  // constructor(protected http: HttpClient, @Inject("url") protected url: string) {}

  findPersonaByDNI(dni: string): Observable<ApiDniResponse> {
    return this.http.get<ApiDniResponse>(`${this.url}/dnireniec/${dni}`).pipe(
      timeout(10000), // 5 segundos
      catchError(error => {
        if (error.name === 'TimeoutError') {
          console.error('La petición excedió el tiempo de espera');
          // Retorna un valor por defecto o maneja el error
          // return of(null);
        }
        return throwError(() => error);
      })
    );
  }
}
