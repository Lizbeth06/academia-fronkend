import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Tipoturno } from "../model/tipoturno.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TipoturnoService extends GenericService<Tipoturno>{
  private tipoturnoChange: Subject<Tipoturno[]> = new Subject<Tipoturno[]>

  constructor(
    protected override http: HttpClient,
  ) { 
    super(
      http,
      `${environment.HOST}/api/tipoturno`
    );
  }
  setTipoturnoChange(data:Tipoturno[]){
    this.tipoturnoChange.next(data);
  }

  getTipoturnoChange(){
    return this.tipoturnoChange.asObservable();
  }
  

}
