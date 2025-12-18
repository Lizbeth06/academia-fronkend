import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Categoriaedad } from "../model/categoriaedad.model";
@Injectable({
  providedIn: "root",
})
export class CategoriaedadService extends GenericService<Categoriaedad> {
  private categoriaChange: Subject<Categoriaedad[]> = new Subject<Categoriaedad[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/categoriaedad`);
  }
  setCategoriaChange(data: Categoriaedad[]) {
    this.categoriaChange.next(data);
  }

  getCategoriaChange() {
    return this.categoriaChange.asObservable();
  }
}
