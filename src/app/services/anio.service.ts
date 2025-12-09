import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Anio } from "../model/anio.model";

@Injectable({
  providedIn: "root",
})
export class AnioService extends GenericService<Anio> {
  private anioChange: Subject<Anio[]> = new Subject<Anio[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/anio`);
  }
  setAnioChange(data: Anio[]) {
    this.anioChange.next(data);
  }

  getAnioChange() {
    return this.anioChange.asObservable();
  }
}
