import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../../../material/material.module';
import { Sede } from '../../../../model/sede.model';
import { SedeService } from '../../../../services/sede.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorService } from '../../../../services/security/paginator.service';
import { MatSort } from '@angular/material/sort';
import { SedesFormComponent } from '../sedes-form/sedes-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../../../../util/modal.service';

@Component({
  selector: 'app-sedes-lista',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MaterialModule,
    SedesFormComponent
  ],
  templateUrl: './sedes-lista.component.html',
  styleUrl: './sedes-lista.component.css',
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorService }],
})
export class SedesListaComponent implements OnInit {
  // Variable de estado
  sedeActual?: Sede;
  hiddenForm = true;

  displayedColumns: string[] = [
    'codigo',
    'nombre',
    'sector',
    'ubicacion',
    'capacidad',
    'estado',
    'acciones'
  ];

  // Servicios
  private sedeService = inject(SedeService);
  private toastrService = inject(ToastrService);
  private modalService = inject(ModalService);

  // Datos)

  dataSource!: MatTableDataSource<Sede>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getAllSede();
  }

  getAllSede() {
    this.sedeService.findAll().subscribe(data => {
      this.crearTabla(data)
    });
  }

  crearTabla(data: Sede[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editarSede(row: Sede): void {
    this.sedeActual = row;
    this.hiddenForm = false;
    window.scroll({ top: 0, behavior: 'smooth' });
  }

  eliminar(sede: Sede) {
    this.modalService.confirm(() => {
      this.sedeService.delete(sede.idSede!).subscribe({
        next: () => {
          this.getAllSede();
          this.toastrService.success('Se elminó correctamente.', 'Exitoso', { timeOut: 3200 });
        },
        error: (error) => {
          this.toastrService.error(error.error.value[0].message, 'Error al eliminar', { timeOut: 3200 });
        }
      });
    }, `Seguro que desea eliminar: ${sede.nombre}`);
  }

  manejarCancelacion() {
    this.hiddenForm = true;
  }

  mostrarFormAgregar() {
    this.sedeActual = undefined;
    this.hiddenForm = false;
    window.scroll({ top: 0, behavior: 'smooth' });

  }

  oculatarFormulario() {
    this.hiddenForm = true;
  }

  guardarSede(datos: Sede) {
    this.hiddenForm = true;
    if (datos.idSede!) {
      this.sedeService.update(datos.idSede, datos).subscribe({
        next: () => {
          this.getAllSede();
          this.toastrService.success('Se actualizaron los datos correctamente.', 'Exitoso', { timeOut: 3200 });
        },
        error: (error) => {
          this.toastrService.error(error.error.value[0].message, 'Error al actualizar', { timeOut: 3200 });
        }
      });
    } else {
      this.sedeService.save(datos).subscribe({
        next: () => {
          this.getAllSede();
          this.toastrService.success('Se guardaron los datos correctamente.', 'Exitoso', { timeOut: 3200 });
        },
        error: (error) => {
          this.toastrService.error(error.error.value[0].message, 'Error en guardar', { timeOut: 3200 });
        }
      });
    }
  }

}
