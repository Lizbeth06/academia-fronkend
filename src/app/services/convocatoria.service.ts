import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Convocatoria } from '../model/convocatoria';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConvocatoriaService extends GenericService<Convocatoria>{
  private convocatoriaChange: Subject<Convocatoria[]> = new Subject<Convocatoria[]>;
  private messageChange: Subject<string>=new Subject<string>;
  
  constructor(
    protected override http: HttpClient
  ) { 
    super(http, `${environment.HOST}/api/convocatoria`)
  }

  setConvocatoriaChange(data: Convocatoria[]) {
    this.convocatoriaChange.next(data);
  }

  getConvocatoriaChange(){
    return this.convocatoriaChange.asObservable();
  }
    
  setMessageChange(data:string){
    this.messageChange.next(data);
  }
  getMessageChange(){ 
    return this.messageChange.asObservable();
  }

  // saveFilelogo(data: File) {
  //   const formdata: FormData = new FormData();
  //   formdata.append('file', data);
  //   return this.http.post<{ url: string }>(`${environment.HOST}/api/institucion/saveLogo`, formdata);
  // }
   
}