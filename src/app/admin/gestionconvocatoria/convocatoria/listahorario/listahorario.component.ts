import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ListaHorario } from "../../../../model/listahorario.model";
import { MaterialModule } from "../../../../material/material.module";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { PaginatorService } from "../../../../services/security/paginator.service";
import { Horario } from "../../../../model/horario.model";
import { ConvocatoriaFormComponent } from "../convocatoria-form/convocatoria-form.component";
import { SelectionModel } from "@angular/cdk/collections";

@Component({
  selector: "app-listahorario",
  imports: [MaterialModule],
  templateUrl: "./listahorario.component.html",
  styleUrl: "./listahorario.component.css",
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorService }],
})
export class ListahorarioComponent implements OnInit, AfterViewInit {
  constructor() {}
  @Input() dialogListahorario!: {
    listaverHorario: Horario[];
  };
  @Input() selection!: SelectionModel<Horario>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() eliminar: EventEmitter<Horario> = new EventEmitter();
  displayedColumns: string[] = ["id", "disciplina", "horario", "modalidad", "ubicacion", "accion"];
  dataSource: MatTableDataSource<Horario>;

  ngOnInit(): void {
    this.crearTabla();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const transformedFilter = filter.trim().toLowerCase();

      const dataStr =
        (data.listadisciplina?.disciplina?.descripcion || "") +
        " " +
        (data.modalidad?.descripcion || "") +
        " " +
        (data.listadisciplina?.sede?.ubicacion || "") +
        " " +
        (data.listadisciplina?.sede?.nombre || "");
      return dataStr.toLowerCase().includes(transformedFilter);
    };
  }

  crearTabla() {
    const data = this.dialogListahorario.listaverHorario;
    this.dataSource = new MatTableDataSource(data);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  resumenHorario(data: Horario): string {
    const dias = data.turno.listadia?.map((l) => l.dias?.codigo).join(", ");
    const hora = `${data.turno.horainicio} a ${data.turno.horafin} `;
    return `${dias} DE ${hora}`;
  }

  getEnumeracion(index: number): number {
    if (!this.dataSource || !this.dataSource.paginator) {
      return index + 1;
    }
    return index + 1 + this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize;
  }

  deleteLista(row: Horario) {
    this.dataSource.data = this.dataSource.data.filter((h) => h.idHorario !== row.idHorario);
    this.selection.deselect(row);
    this.eliminar.emit(row);
  }
}
