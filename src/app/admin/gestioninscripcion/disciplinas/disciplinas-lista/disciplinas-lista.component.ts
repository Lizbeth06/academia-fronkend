import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../../../material/material.module';

@Component({
  selector: 'app-disciplinas-lista',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MaterialModule
  ],
  templateUrl: './disciplinas-lista.component.html',
  styleUrl: './disciplinas-lista.component.css'
})
export class DisciplinasListaComponent {

  disciplinaForm: FormGroup;

  displayedColumns = [
    "codigo",
    "descripcion",
    "estado",
    "acciones"
  ];

  dataSource = new MatTableDataSource<any>([]);

  constructor(private fb: FormBuilder) {
    this.disciplinaForm = this.fb.group({
      id: [null],
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['Activo', Validators.required],
      fechaRegistro: ['']
    });
  }

  guardar() {
    if (this.disciplinaForm.invalid) {
      this.disciplinaForm.markAllAsTouched();
      return;
    }

    const form = this.disciplinaForm.value;

    if (!form.id) {
      form.id = this.dataSource.data.length + 1;
      form.fechaRegistro = new Date();
      this.dataSource.data = [...this.dataSource.data, form];
    } else {
      const index = this.dataSource.data.findIndex(x => x.id === form.id);
      this.dataSource.data[index] = form;
      this.dataSource._updateChangeSubscription();
    }

    this.limpiar();
  }

  limpiar() {
    this.disciplinaForm.reset({
      id: null,
      estado: 'Activo'
    });
  }

  editar(row: any) {
    this.disciplinaForm.patchValue(row);
    window.scroll({ top: 0, behavior: 'smooth' });
  }

  eliminar(row: any) {
    if (confirm("¿Deseas eliminar esta disciplina?")) {
      const filtered = this.dataSource.data.filter(x => x.id !== row.id);
      this.dataSource.data = [...filtered];  // Refresca tabla
    }
  }

  aplicarFiltro(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }
}
