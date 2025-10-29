import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Institucion } from '../model/institucion';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstitucionService extends GenericService<Institucion>{
  private institucionChange: Subject<Institucion[]> = new Subject<Institucion[]>;
  private messageChange: Subject<string>=new Subject<string>;
  
  constructor(
    protected override http: HttpClient
  ) { 
    super(http, `${environment.HOST}/api/institucion`)
  }
  

  setMenuInstitucionChange(data: Institucion[]) {
    this.institucionChange.next(data);
  }

  getMenuInstitucionChange(){
    return this.institucionChange.asObservable();
  }

  findByRuc(tipodocumento:number,numdocumento:string){
    const params = new HttpParams()
    .set('tipodocumento', tipodocumento)
    .set('numdocumento', numdocumento);
  return this.http.get<Institucion[]>(`${environment.HOST}/api/institucion/searchxnumdoc`, { params });
  }
    
  setMessageChange(data:string){
    this.messageChange.next(data);
  }
  getMessageChange(){ 
    return this.messageChange.asObservable();
  }
  saveFilelogo(data: File) {
    const formdata: FormData = new FormData();
    formdata.append('file', data);
    return this.http.post<{ url: string }>(`${environment.HOST}/api/institucion/saveLogo`, formdata);
  }
   
}