import { Injectable } from "@angular/core";
import { Sede } from "../model/sede.model";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SedeService extends GenericService<Sede> {
  private sedeChange: Subject<Sede[]> = new Subject<Sede[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/sede`);
  }
  urlApi = `${environment.HOST}/api/sede`;

  getSedexubicacion(ubi: string) {
    const params = new HttpParams().set("ubicacion", ubi);
    return this.http.get<Sede[]>(`${this.urlApi}/ubicacion`, { params });
  }

  findAllByCodubi(codubi: number) {
    const params = new HttpParams().set("codubi", codubi);
    return this.http.get<Sede[]>(`${this.urlApi}`, { params });
  }

  setSedeChange(data: Sede[]) {
    this.sedeChange.next(data);
  }

  getSedeChange() {
    return this.sedeChange.asObservable();
  }
}
