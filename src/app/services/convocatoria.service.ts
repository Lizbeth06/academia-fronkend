import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { Convocatoria } from "../model/convocatoria";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Observable, of, Subject } from "rxjs";
import { Listahorariobloque } from "../model/listahorario.model";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: "root",
})
export class ConvocatoriaService extends GenericService<Convocatoria> {
  private convocatoriaChange: Subject<Convocatoria[]> = new Subject<Convocatoria[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient, private tokenService: TokenService) {
    super(http, `${environment.HOST}/api/convocatoria`);
  }

  setConvocatoriaChange(data: Convocatoria[]) {
    this.convocatoriaChange.next(data);
  }

  getConvocatoriaChange() {
    return this.convocatoriaChange.asObservable();
  }
}
