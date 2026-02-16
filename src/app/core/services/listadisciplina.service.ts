import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Listadisciplina } from "../model/horario.model";

@Injectable({
  providedIn: "root",
})
export class ListadisciplinaService extends GenericService<Listadisciplina> {
  private listadisciplinaChange: Subject<Listadisciplina[]> = new Subject<Listadisciplina[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/listadisciplina`);
  }
  urlApi = `${environment.HOST}/api/listadisciplina`;

  setListadisciplinaChange(data: Listadisciplina[]) {
    this.listadisciplinaChange.next(data);
  }

  getListadisciplinaChange() {
    return this.listadisciplinaChange.asObservable();
  }
}
