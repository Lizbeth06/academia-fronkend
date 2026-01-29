import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Ubigeo } from "../model/ubigeo.model";

@Injectable({
  providedIn: "root",
})
export class UbigeoService extends GenericService<Ubigeo> {
  private ubigeoChange: Subject<Ubigeo[]> = new Subject<Ubigeo[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/ubigeo`);
  }

  getAllDepartments() {
    return this.http.get<Ubigeo[]>(`${environment.HOST}/api/ubigeo/departamentos`);
  }

  findProvincias(department: string) {
    return this.http.get<Ubigeo[]>(`${environment.HOST}/api/ubigeo/provincias/${department}`);
  }

  findDistritos(department: string, provincia: string) {
    const params = new HttpParams().set("departamento", department).set("provincia", provincia);
    return this.http.get<Ubigeo[]>(`${environment.HOST}/api/ubigeo/distritos`, { params });
  }

  setUbigeoChange(data: Ubigeo[]) {
    this.ubigeoChange.next(data);
  }

  getUbigeoChange() {
    return this.ubigeoChange.asObservable();
  }
}
