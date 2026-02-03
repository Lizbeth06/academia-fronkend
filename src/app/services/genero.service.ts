import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Genero } from "../model/genero.model";

@Injectable({
  providedIn: "root",
})
export class GeneroService extends GenericService<Genero> {
  private generoChange: Subject<Genero[]> = new Subject<Genero[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/genero`);
  }
  setGeneroChange(data: Genero[]) {
    this.generoChange.next(data);
  }

  getGeneroChange() {
    return this.generoChange.asObservable();
  }
}
