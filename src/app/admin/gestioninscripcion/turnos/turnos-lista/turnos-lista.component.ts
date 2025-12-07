import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";

import { MaterialModule } from "../../../../material/material.module";
import { TurnosFormComponent } from "../turnos-form/turnos-form.component";
import { Turno } from "../../../../model/turno.model";
import { TurnoService } from "../../../../services/turno.service";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { PaginatorService } from "../../../../services/security/paginator.service";

@Component({
  selector: "app-turno",
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, TurnosFormComponent],
  templateUrl: "./turnos-lista.component.html",
  styleUrls: ["./turnos-lista.component.css"],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorService }],
})
export class TurnosListaComponent implements OnInit {
  constructor() {}
  private turnoServicio = inject(TurnoService);
  dataSource: MatTableDataSource<Turno>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(TurnosFormComponent) formulario!: TurnosFormComponent;

  displayedColumns = ["id", "horario", "hora_inicio", "hora_fin", "acciones"];

  ngOnInit(): void {
    this.getAllSede();
  }
  getAllSede() {
    this.turnoServicio.findAll().subscribe((data) => {
      this.crearTabla(data);
    });
  }
  crearTabla(data: Turno[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  editarTurno(id: number) {
    this.formulario.editarTurno(id);
    window.scroll({ top: 0, behavior: "smooth" });
  }

  eliminarTurno(row: any) {
    // this.dataSource.data = this.dataSource.data.filter((t) => t.id !== row.id);
  }

  limpiarFormulario() {
    // this.turnoForm.reset({
    //   id: null
    // });
  }

  aplicarFiltro(v: string) {
    this.dataSource.filter = v.trim().toLowerCase();
  }
}
