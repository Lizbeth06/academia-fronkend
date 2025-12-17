import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Tiposeguro } from "../model/tiposeguro.model";

@Injectable({
  providedIn: "root",
})
export class TiposeguroService extends GenericService<Tiposeguro> {
  private tiposeguroChange: Subject<Tiposeguro[]> = new Subject<Tiposeguro[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/tiposeguro`);
  }
  setTipoSeguroChange(data: Tiposeguro[]) {
    this.tiposeguroChange.next(data);
  }

  getTipoSeguroChange() {
    return this.tiposeguroChange.asObservable();
  }
}
