import { Injectable } from "@angular/core";
import { Sede } from "../model/sede.model";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SedeService extends GenericService<Sede>{
  private tipodocumentoChange: Subject<Sede[]> = new Subject<Sede[]>

  constructor(
    protected override http: HttpClient,
  ) { 
    super(
      http,
      `${environment.HOST}/api/sede`
    );
  }

  

  setTipodocumentoChange(data:Sede[]){
    this.tipodocumentoChange.next(data);
  }

  getTipodocumentoChange(){
    return this.tipodocumentoChange.asObservable();
  }
  

}
