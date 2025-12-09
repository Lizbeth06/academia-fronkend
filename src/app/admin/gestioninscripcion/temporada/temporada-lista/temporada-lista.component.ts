import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";

// Angular Material
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from "@angular/material/core";
import { TemporadaFormComponent } from "../temporada-form/temporada-form.component";
import { MaterialModule } from "../../../../material/material.module";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { PaginatorService } from "../../../../services/security/paginator.service";
import { MatTableDataSource } from "@angular/material/table";
import { TemporadaService } from "../../../../services/temporada.service";
import { Temporada } from "../../../../model/temporada.model";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-temporada-lista",
  standalone: true,
  imports: [CommonModule, MaterialModule, TemporadaFormComponent],
  templateUrl: "./temporada-lista.component.html",
  styleUrl: "./temporada-lista.component.css",

  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorService }],
})
export class TemporadaListaComponent implements OnInit {
  constructor() {}
  displayedColumns = ["id", "descripcion", "fapertura", "fcierre", "finicioclase", "ffinclase", "anio", "fregistro", "acciones"];

  private temporadaServicio = inject(TemporadaService);

  @ViewChild(TemporadaFormComponent) formulario!: TemporadaFormComponent;

  dataSource: MatTableDataSource<Temporada>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getAllTemporada();
  }
  getAllTemporada() {
    this.temporadaServicio.findAll().subscribe((data) => {
      console.log(data);
      this.crearTabla(data);
    });
  }
  crearTabla(data: Temporada[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  editarTemporada(id: number) {
    this.formulario.editarTemporada(id);
    window.scroll({ top: 0, behavior: "smooth" });
  }

  eliminarTemporada(temp: any): void {
    const confirmar = confirm(`¿Eliminar la temporada ${temp.descripcion} (${temp.anio})?`);
  }

  limpiarFormulario(): void {}

  aplicarFiltro(v: string) {
    this.dataSource.filter = v.trim().toLowerCase();
  }
}
