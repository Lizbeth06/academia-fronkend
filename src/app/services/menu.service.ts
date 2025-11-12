import { Injectable } from '@angular/core';
import { Menu } from '../model/menu';
import { Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericService<Menu>{
  private menuChange = new Subject<Menu[]>();

  constructor(
    http: HttpClient
  ) {
    super(
      http, 
      `${environment.HOST}/api/menu`
    );
  }

  getMenuByUser(username:string){
    return this.http.post<Menu[]>(`${this.url}/usuario`,username);
  }

  getMenuByidRolUsuario(idRol:number,idUsuario:number){
      const params = new HttpParams()
      .set('id_rol', idRol)
      .set('id_usuario', idUsuario);

    return this.http.get<Menu[]>(`${environment.HOST}/api/menu/allusuariorol`, { params });
  }

  //Cambios

  getMenuChange(){
    return this.menuChange.asObservable();
  }

  setMenuChange(menus:Menu[]){
    this.menuChange.next(menus);
  }

}
