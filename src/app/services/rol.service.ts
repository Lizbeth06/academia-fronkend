import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Rol } from '../model/rol';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService extends GenericService<Rol>{
  private rolChange: Subject<Rol[]> = new Subject<Rol[]>;

  constructor(
    protected override http: HttpClient
  ) { 
    super(http, `${environment.HOST}/api/rol`)
  }

  setMenuCategoriaChange(data: Rol[]) {
    this.rolChange.next(data);
  }

  getMenuCategoriaChange(){
    return this.rolChange.asObservable();
  }
}