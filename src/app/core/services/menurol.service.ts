import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { MenuRol } from "../model/menu-rol";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class MenuRolService extends GenericService<MenuRol> {
  private menurolChange: Subject<MenuRol[]> = new Subject<MenuRol[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/menurol`);
  }

  setMenuCategoriaChange(data: MenuRol[]) {
    this.menurolChange.next(data);
  }

  getMenuCategoriaChange() {
    return this.menurolChange.asObservable();
  }
}
