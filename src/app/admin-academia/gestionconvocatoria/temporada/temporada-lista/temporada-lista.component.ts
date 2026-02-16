import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";

// Angular Material
import { TemporadaFormComponent } from "../temporada-form/temporada-form.component";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MaterialModule } from "../../../../shared/components/material/material.module";
import { PaginatorService } from "../../../../core/services/security/paginator.service";
import { TemporadaService } from "../../../../core/services/temporada.service";
import { Temporada } from "../../../../core/model/temporada.model";

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
