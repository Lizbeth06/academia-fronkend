import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RucService {
  private API_URL = "https://dniruc.apisperu.com/api/v1"
  private TOKEN = environment.TOKEN_DNIRUC


  constructor(private http: HttpClient) { console.log('TOKEN_DNIRUC en servicio:', this.TOKEN);}

  consultarRUC(ruc: string): Observable<any> {
    if (!ruc) {
      throw new Error('El RUC es requerido');
    }
    const url = `${this.API_URL}/ruc/${ruc}?token=${this.TOKEN}`;
    return this.http.get<any>(url);
  }

  consultarDni(dni:string):Observable<any>{
    const url = `${this.API_URL}/dni/${dni}?token=${this.TOKEN}`;
    return this.http.get<any>(url)
  }
}