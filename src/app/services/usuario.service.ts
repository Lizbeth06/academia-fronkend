import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Usuario } from '../model/usuario';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Persona } from '../model/persona';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends GenericService<Usuario>{
  private usuarioChange: Subject<Usuario[]> = new Subject<Usuario[]>
  private messageChange: Subject<string>=new Subject<string>;

  constructor(
    protected override http: HttpClient,
  ) { 
    super(
      http,
      `${environment.HOST}/api/usuario`
    );
  }

  findByUsername(username: string):Observable<Usuario>{
    return this.http.get<Usuario>(`${this.url}/username/${username}`);
  } 

  findTipodocByNumdoc(tipodocumento:number,numdocumento:string){
        const params = new HttpParams()
        .set('tipodocumento', tipodocumento)
        .set('numdocumento', numdocumento);
      return this.http.get<Persona[]>(`${environment.HOST}/api/persona/searchxnumdoc`, { params });
      }
  

  setUsuarioChange(data:Usuario[]){
    this.usuarioChange.next(data);
  }

  getUsuarioChange(){
    return this.usuarioChange.asObservable();
  }

  setMessageChange(data:string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

 //para mandar archivo al back
  saveFile(data: File) {
    const formdata: FormData = new FormData();
    formdata.append('file', data);
    return this.http.post<{ url: string }>(`${environment.HOST}/api/curso/saveFile`, formdata);
  }

  actualizarFoto(idUsuario: number, urlFoto: string) {
  return this.http.put<void>(`${environment.HOST}/api/usuario/${idUsuario}/foto`, urlFoto, {
    headers: { 'Content-Type': 'text/plain' } // 👈 importante: enviar como texto plano
  });
}
  
}
