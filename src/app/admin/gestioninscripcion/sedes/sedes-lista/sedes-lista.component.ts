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

@Component({
  selector: 'app-sedes-lista',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MaterialModule
  ],
  templateUrl: './sedes-lista.component.html',
  styleUrl: './sedes-lista.component.css', 
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorService }],
})
export class SedesListaComponent implements OnInit {
  
  sedeForm: FormGroup;
  
  displayedColumns: string[] = [
    'codigo',
    'nombre',
    'sector',
    'ubicacion',
    'capacidad',
    'estado',
    'acciones'
  ];
  
  constructor(private fb: FormBuilder) {
    this.sedeForm = this.fb.group({
      id: [null],
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      id_sector: ['', Validators.required],
      id_ubigeo: [''],
      direccion: [''],
      capacidad: [null, [Validators.min(0)]],
      estado: ['Activo', Validators.required]
    });
  
  }
  private sedeService=inject(SedeService);

  dataSource!:MatTableDataSource<Sede>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
   this.getAllSede(); 
  }
  getAllSede(){
    this.sedeService.findAll().subscribe(data=>{
      console.log(data);
      this.crearTabla(data)});
  }
  crearTabla(data: Sede[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  guardarSede(): void {
    if (this.sedeForm.invalid) {
      this.sedeForm.markAllAsTouched();
      return;
    }

    const formValue = this.sedeForm.value;

    // if (!formValue.id) {
    //   // nueva sede
    //   formValue.id = this.dataSource.data.length
    //     ? Math.max(...this.dataSource.data.map(s => s.id)) + 1
    //     : 1;

    //   this.dataSource.data = [...this.dataSource.data, formValue];
    // } else {
    //   // edición
    //   const index = this.dataSource.data.findIndex(s => s.id === formValue.id);
    //   if (index !== -1) {
    //     this.dataSource.data[index] = formValue;
    //     this.dataSource._updateChangeSubscription();
    //   }
    // }

    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.sedeForm.reset({
      id: null,
      codigo: '',
      nombre: '',
      id_sector: '',
      id_ubigeo: '',
      direccion: '',
      capacidad: null,
      estado: 'Activo'
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
 
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editarSede(row: any): void {
    this.sedeForm.patchValue(row);
    window.scroll({ top: 0, behavior: 'smooth' });
  }


  eliminar(row: any) {
  if (confirm('¿Estás seguro de eliminar esta disciplina?')) {
    this.dataSource.data = this.dataSource.data.filter(item => item !== row);
  }
}

}
