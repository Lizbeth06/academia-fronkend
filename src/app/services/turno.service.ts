import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Turno } from "../model/turno.model";

@Injectable({
  providedIn: 'root'
})
export class TurnoService extends GenericService<Turno>{
  private turnoChange: Subject<Turno[]> = new Subject<Turno[]>

  constructor(
    protected override http: HttpClient,
  ) { 
    super(
      http,
      `${environment.HOST}/api/turno`
    );
  }
  setTurnoChange(data:Turno[]){
    this.turnoChange.next(data);
  }

  getTurnoChange(){
    return this.turnoChange.asObservable();
  }
  

}
