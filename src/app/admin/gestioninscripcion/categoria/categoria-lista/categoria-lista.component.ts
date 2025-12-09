import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";

// Angular Material
import { CategoriaFormComponent } from "../categoria-form/categoria-form.component";
import { MaterialModule } from "../../../../material/material.module";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { PaginatorService } from "../../../../services/security/paginator.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { CategoriaService } from "../../../../services/categoria.service";
import { Categoria } from "../../../../model/categoria.model";

@Component({
  selector: "app-categoria-lista",
  standalone: true,
  imports: [CommonModule, MaterialModule, CategoriaFormComponent],
  templateUrl: "./categoria-lista.component.html",
  styleUrl: "./categoria-lista.component.css",

  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorService }],
})
export class CategoriaListaComponent implements OnInit {
  constructor() {}
  displayedColumns = ["id", "descripcion", "edadminima", "edadmaxima", "grupo", "estado", "acciones"];

  private categoriaServicio = inject(CategoriaService);

  @ViewChild(CategoriaFormComponent) formulario!: CategoriaFormComponent;

  dataSource: MatTableDataSource<Categoria>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getAllCategoria();
  }
  getAllCategoria() {
    this.categoriaServicio.findAll().subscribe((data) => {
      console.log(data);
      this.crearTabla(data);
    });
  }
  crearTabla(data: Categoria[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  editarCategoria(id: number) {
    this.formulario.editarCategoria(id);
    window.scroll({ top: 0, behavior: "smooth" });
  }

  eliminarCategoria(temp: any): void {
    const confirmar = confirm(`¿Eliminar la categoria ${temp.descripcion} (${temp.anio})?`);
  }

  limpiarFormulario(): void {}

  aplicarFiltro(v: string) {
    this.dataSource.filter = v.trim().toLowerCase();
  }
}
