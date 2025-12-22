import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Modalidad } from "../model/horario.model";
@Injectable({
  providedIn: "root",
})
export class ModalidadService extends GenericService<Modalidad> {
  private modalidadChange: Subject<Modalidad[]> = new Subject<Modalidad[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/modalidad`);
  }
  setModalidadChange(data: Modalidad[]) {
    this.modalidadChange.next(data);
  }

  getModalidadChange() {
    return this.modalidadChange.asObservable();
  }
}
