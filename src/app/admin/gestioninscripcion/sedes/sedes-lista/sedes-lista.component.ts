import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../../../material/material.module';

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
  styleUrl: './sedes-lista.component.css'
})
export class SedesListaComponent {

  sedeForm: FormGroup;

  displayedColumns: string[] = [
    'codigo',
    'nombre',
    'sector',
    'ubigeo',
    'capacidad',
    'estado',
    'acciones'
  ];

  dataSource = new MatTableDataSource<any>([]);

  sectores = [
    { id: 1, descripcion: 'Público' },
    { id: 2, descripcion: 'Privado' }
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

    // Datos de ejemplo
    this.dataSource.data = [
      {
        id: 1,
        codigo: 'S001',
        nombre: 'Sede Central',
        id_sector: 1,
        id_ubigeo: 'Lima - Cercado',
        direccion: 'Av. Siempre Viva 123',
        capacidad: 300,
        estado: 'Activo'
      },
      {
        id: 2,
        codigo: 'S002',
        nombre: 'Sede Norte',
        id_sector: 2,
        id_ubigeo: 'Lima - Los Olivos',
        direccion: 'Jr. Los Laureles 456',
        capacidad: 180,
        estado: 'Inactivo'
      }
    ];

    // Filtro por texto simple (convierte cada fila a JSON)
    this.dataSource.filterPredicate = (data, filter) =>
      JSON.stringify(data).toLowerCase().includes(filter);
  }

  guardarSede(): void {
    if (this.sedeForm.invalid) {
      this.sedeForm.markAllAsTouched();
      return;
    }

    const formValue = this.sedeForm.value;

    if (!formValue.id) {
      // nueva sede
      formValue.id = this.dataSource.data.length
        ? Math.max(...this.dataSource.data.map(s => s.id)) + 1
        : 1;

      this.dataSource.data = [...this.dataSource.data, formValue];
    } else {
      // edición
      const index = this.dataSource.data.findIndex(s => s.id === formValue.id);
      if (index !== -1) {
        this.dataSource.data[index] = formValue;
        this.dataSource._updateChangeSubscription();
      }
    }

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

  aplicarFiltro(texto: string): void {
    this.dataSource.filter = texto.trim().toLowerCase();
  }

  editarSede(row: any): void {
    this.sedeForm.patchValue(row);
    window.scroll({ top: 0, behavior: 'smooth' });
  }

  obtenerSectorDescripcion(id: number): string {
    return this.sectores.find(s => s.id === id)?.descripcion || '';
  }

  eliminar(row: any) {
  if (confirm('¿Estás seguro de eliminar esta disciplina?')) {
    this.dataSource.data = this.dataSource.data.filter(item => item !== row);
  }
}

}
