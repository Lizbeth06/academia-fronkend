import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Anio } from "../model/anio.model";
import { Nivel } from "../model/horario.model";

@Injectable({
  providedIn: "root",
})
export class NivelService extends GenericService<Nivel> {
  private nivelChange: Subject<Nivel[]> = new Subject<Nivel[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/nivel`);
  }
  setNivelChange(data: Nivel[]) {
    this.nivelChange.next(data);
  }

  getNivelChange() {
    return this.nivelChange.asObservable();
  }
}
