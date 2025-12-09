import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Criterioparticipacion } from "../model/categoria.model";
@Injectable({
  providedIn: "root",
})
export class CriterioparticipacionService extends GenericService<Criterioparticipacion> {
  private criterioparticipacionChange: Subject<Criterioparticipacion[]> = new Subject<Criterioparticipacion[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/criterioparticipacion`);
  }
  setCriterioparticipacionChange(data: Criterioparticipacion[]) {
    this.criterioparticipacionChange.next(data);
  }

  getCriterioparticipacionChange() {
    return this.criterioparticipacionChange.asObservable();
  }
}
