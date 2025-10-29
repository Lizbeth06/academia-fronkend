import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Usuario } from '../model/usuario';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends GenericService<Usuario>{
  private usuarioChange: Subject<Usuario[]> = new Subject<Usuario[]>;

  constructor(
    protected override http: HttpClient
  ) { 
    super(http, `${environment.HOST}/api/usuario`)
  }

  setMenuCategoriaChange(data: Usuario[]) {
    this.usuarioChange.next(data);
  }

  getMenuCategoriaChange(){
    return this.usuarioChange.asObservable();
  }
}