import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Tipoconvocatoria } from '../model/tipoconvocatoria';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TipoconvocatoriaService extends GenericService<Tipoconvocatoria>{
  private oficinaChange: Subject<Tipoconvocatoria[]> = new Subject<Tipoconvocatoria[]>

  constructor(
    protected override http: HttpClient,
  ) { 
    super(
      http,
      `${environment.HOST}/api/tipoconvocatoria`
    );
  }

  setOficinaChange(data:Tipoconvocatoria[]){
    this.oficinaChange.next(data);
  }

  getOficinaChange(){
    return this.oficinaChange.asObservable();
  }
  
}
