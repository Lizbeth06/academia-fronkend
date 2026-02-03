import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Validacioninscripcion, ValidacioninscripcionSave } from "../model/validacioninscripcion.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ValidacioninscripcionService extends GenericService<Validacioninscripcion> {
  private anioChange: Subject<Validacioninscripcion[]> = new Subject<Validacioninscripcion[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/validacioninscripcion`);
  }

  saveValidacioninscripcion(validacion: ValidacioninscripcionSave) {
    return this.http.post(`${environment.HOST}/api/validacioninscripcion`, validacion);
  }

  setAnioChange(data: Validacioninscripcion[]) {
    this.anioChange.next(data);
  }

  getAnioChange() {
    return this.anioChange.asObservable();
  }
}
