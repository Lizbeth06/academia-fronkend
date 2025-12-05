import { inject, Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { environment } from '../environments/environment';
import { Pago } from '../model/pago';
import { TokenService } from './token.service';
import { CertificadoService } from './certificado.service';

@Injectable({
  providedIn: 'root'
})
export class PagoService extends GenericService<Pago>{
  private pagoChange: Subject<Pago[]> = new Subject<Pago[]>

  constructor(
    protected override http: HttpClient,
    private tokenService:TokenService
  ) { 
    super(
      http,
      `${environment.HOST}/api/pago`
    );
  }
  pagoInscripcion(id:number, idCuotas?:string): Observable<Pago> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.put<Pago>(`${environment.HOST}/api/pago/pago-inscripcion/${id}?cuotas=${idCuotas}`,  {
      headers: {
        Authorization: `Bearer ${token}`
      },observe : 'response'
    } );
  }
  //Lista de idPago por dni
  getIdpagoxdoc(numDocumento: string): Observable<any> {
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get(`${environment.HOST}/api/pago/nrodocumento/${numDocumento}`,{
      headers: {
        Authorization: `Bearer ${token}`
      },observe : 'response'
    });
  }
  //Pdf
  generarPdfpago(id:number){
    const token: string = this.tokenService.getToken() ?? '';
    return this.http.get(`${environment.HOST}/api/reporte/${id}/pdf`, {
      headers: {
        Authorization: `Bearer ${token}`
      },responseType:'blob' 
    } );
  }

  setPagoChange(data:Pago[]){
    this.pagoChange.next(data);
  }

  getPagoChange(){
    return this.pagoChange.asObservable();
  }
  
}
