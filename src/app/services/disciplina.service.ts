import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, of, Subject } from 'rxjs';
import { Disciplina } from '../model/disciplina';

@Injectable({
  providedIn: 'root'
})
export class DisciplinaService extends GenericService<Disciplina>{
  private disciplinaChange: Subject<Disciplina[]> = new Subject<Disciplina[]>;
  private messageChange: Subject<string>=new Subject<string>;
  
  constructor(
    protected override http: HttpClient
  ) { 
    super(http, `${environment.HOST}/api/disciplina`)
  }

  setDisciplinaChange(data: Disciplina[]) {
    this.disciplinaChange.next(data);
  }

  getDisciplinaChange(){
    return this.disciplinaChange.asObservable();
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