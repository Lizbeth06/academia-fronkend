
import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Menu } from '../model/menu';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Menugrupo } from '../model/menugrupo';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenugrupoService extends GenericService<Menugrupo>{
  private menugrupoChange = new Subject<Menugrupo[]>();
  private messageChange: Subject<string> = new Subject<string>;

  constructor(
    http: HttpClient
  ) {
    super(
      http, 
      `${environment.HOST}/api/menugrupo`
    );
  }

  setMenugrupoChange(data: Menugrupo[]) {
    this.menugrupoChange.next(data);
  }

  getMenugrupoChange(){
    return this.menugrupoChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
