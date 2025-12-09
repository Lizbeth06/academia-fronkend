import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Categoria } from "../model/categoria.model";
@Injectable({
  providedIn: "root",
})
export class CategoriaService extends GenericService<Categoria> {
  private categoriaChange: Subject<Categoria[]> = new Subject<Categoria[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/categoriaedad`);
  }
  setCategoriaChange(data: Categoria[]) {
    this.categoriaChange.next(data);
  }

  getCategoriaChange() {
    return this.categoriaChange.asObservable();
  }
}
