import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Anio } from "../model/anio.model";
import { Dias } from "../model/dias.model";
import { Listahorario } from "../model/listahorario";

@Injectable({
  providedIn: "root",
})
export class ListahorarioService extends GenericService<Listahorario> {
  private listahorarioChange: Subject<Listahorario[]> = new Subject<Listahorario[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/listahorario`);
  }

  findDisponibles(edad:number, idModalidad: number, idSede: number){
    const params = new HttpParams();
    params.set("edad", edad);
    params.set("idModalidad", idModalidad);
    params.set("idSede", idSede);
    return this.http.get<Listahorario[]>(`${this.url}/disponibles`, {params});
  }

  setListahorarioChange(data: Listahorario[]) {
    this.listahorarioChange.next(data);
  }

  getListahorarioChange() {
    return this.listahorarioChange.asObservable();
  }
}
