import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Dias } from "../model/dias.model";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DiasService extends GenericService<Dias> {
  private diasChange: Subject<Dias[]> = new Subject<Dias[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/dias`);
  }
  setDiasChange(data: Dias[]) {
    this.diasChange.next(data);
  }

  getDiasChange() {
    return this.diasChange.asObservable();
  }
}
