import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Temporada } from "../model/temporada.model";

@Injectable({
  providedIn: "root",
})
export class TemporadaService extends GenericService<Temporada> {
  private temporadaChange: Subject<Temporada[]> = new Subject<Temporada[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/temporada`);
  }
  setTemporadaChange(data: Temporada[]) {
    this.temporadaChange.next(data);
  }

  getTemporadaChange() {
    return this.temporadaChange.asObservable();
  }
}
