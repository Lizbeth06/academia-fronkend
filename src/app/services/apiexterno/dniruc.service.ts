import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DnirucService {

  constructor(
    private http: HttpClient,
    private toastr:ToastrService
  ) { }
  private apiUrl = 'https://dniruc.apisperu.com/api/v1'
  private token='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Inlvbm55Lmh1YXJhbmNjYS4yN0B1bnNjaC5lZHUucGUifQ.Zr-6YvQF2S9W8e25Vi5BFzgRyo5uXRR_DBQBiUqyeTs';
  
  getDniInfo(dni: string): Observable<any> {
    const url = `${this.apiUrl}/dni/${dni}?token=${this.token}`; 
    return this.http.get<any>(url).pipe(
      catchError(error => {
        this.toastr.error('Ocurrió un error:', error);
        return of(null); 
      })
    ); 
  }
  
  getRucInfo(ruc: string): Observable<any> {
    const url = `${this.apiUrl}/ruc/${ruc}?token=${this.token}`; 
    return this.http.get<any>(url).pipe(
      catchError(error => {
        this.toastr.error('Ocurrió un error:', error);
        return of(null); 
      })
    ); 
  }
}
