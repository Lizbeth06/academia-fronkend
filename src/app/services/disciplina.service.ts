import { Injectable } from "@angular/core";
import { Disciplina } from "../model/disciplina.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GenericService } from "./generic.service";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class DisciplinaService extends GenericService<Disciplina> {
  private disciplinaChange: Subject<Disciplina[]> = new Subject<Disciplina[]>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/api/disciplina`);
  }
  urlApi = `${environment.HOST}/api/disciplina`;

  getAllDisciplinaxsede(idSede: number) {
    return this.http.get<Disciplina[]>(`${this.urlApi}/disciplinaxsede/${idSede}`);
  }

  setDisciplinaChange(data: Disciplina[]) {
    this.disciplinaChange.next(data);
  }

  getDisciplinaChange() {
    return this.disciplinaChange.asObservable();
  }
}
