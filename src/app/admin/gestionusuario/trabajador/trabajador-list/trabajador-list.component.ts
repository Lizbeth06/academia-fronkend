import { AfterViewInit, Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TrabajadorFormComponent } from '../trabajador-form/trabajador-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '../../../../material/material.module';
import { Trabajador } from '../../../../model/trabajador';
import { TrabajadorService } from '../../../../services/trabajador.service';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../../../../util/modal.service';

@Component({
  selector: 'app-trabajdor-list',
  imports: [MaterialModule],
  templateUrl: './trabajador-list.component.html',
  styleUrl: './trabajador-list.component.css'
})
export class TrabajadorListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'foto', 'codigo', 'documento', 'nombres', 'fingreso', 'oficina', 'accion'];
  dataSource!: MatTableDataSource<Trabajador>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  toastrService = inject(ToastrService);
  modalService = inject(ModalService);

  constructor(
    private trabajadorService: TrabajadorService
  ) { }

  ngOnInit(): void {
    this.listarTrabajadores();
  }

  listarTrabajadores() {
    this.trabajadorService.findAll().subscribe(data => {
      this.crearTabla(data);
    });
  }

  crearTabla(data: Trabajador[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  readonly dialog = inject(MatDialog);

  openDialog(id?: number): void {
    this.dialog.open(TrabajadorFormComponent, {
      data: id,
      width: '70vw',
      height: '70vh',
      maxWidth: 'none',
      enterAnimationDuration: '30ms',
      exitAnimationDuration: '15ms',
    });
  }

  delete(id: number) {
    this.modalService.confirm(() => {
      this.trabajadorService.delete(id).subscribe({
        next: () => {
          this.listarTrabajadores();
          this.toastrService.success('Se elminó correctamente.', 'Exitoso', { timeOut: 3200 });
        },
        error: (error) => {
          this.toastrService.error(error.error.value[0].message, 'Error al eliminar', { timeOut: 3200 });
        }
      });
    }, `Seguro que desea eliminar este trabajador?`);
  }

}
