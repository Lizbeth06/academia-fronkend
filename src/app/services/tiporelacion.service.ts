import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Tiporelacion } from "../model/tiporelacion.model";

@Injectable({
  providedIn: "root",
})
export class TiporelacionService extends GenericService<Tiporelacion> {
  private tiporelacionChange: Subject<Tiporelacion[]> = new Subject<Tiporelacion[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/tiporelacion`);
  }
  setTiporelacionChange(data: Tiporelacion[]) {
    this.tiporelacionChange.next(data);
  }

  getTiporelacionChange() {
    return this.tiporelacionChange.asObservable();
  }
}
