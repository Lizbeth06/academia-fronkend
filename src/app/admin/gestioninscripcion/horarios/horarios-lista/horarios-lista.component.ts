import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../../../material/material.module';

@Component({
  selector: 'app-horarios-lista',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MaterialModule
  ],
  templateUrl: './horarios-lista.component.html',
  styleUrl: './horarios-lista.component.css'
})
export class HorariosListaComponent implements OnInit {

  horarioForm!: FormGroup;

  displayedColumns: string[] = [
    'turno',
    'disciplina',
    'categoria',
    'temporada',
    'contador',
    'vacantes',
    'estado',
    'acciones'
  ];

  dataSource = new MatTableDataSource<any>([]);

  // Datos simulados (reemplazar luego con API)
  turnos = [
    { id: 1, nombre: 'Mañana' },
    { id: 2, nombre: 'Tarde' },
    { id: 3, nombre: 'Noche' }
  ];

  disciplinas = [
    { id: 1, nombre: 'Fútbol' },
    { id: 2, nombre: 'Vóley' },
    { id: 3, nombre: 'Karate' }
  ];

  categorias = [
    { id: 1, nombre: 'Niños' },
    { id: 2, nombre: 'Jóvenes' },
    { id: 3, nombre: 'Adultos' }
  ];

  temporadas = [
    { id: 1, descripcion: 'Invierno 2025' },
    { id: 2, descripcion: 'Verano 2026' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.horarioForm = this.fb.group({
      id: [null],
      turnoId: [null, Validators.required],
      disciplinaId: [null, Validators.required],
      categoriaId: [null, Validators.required],
      temporadaId: [null, Validators.required],
      contador: [0, Validators.required],
      numVacante: [0, Validators.required],
      estado: ['Activo', Validators.required]
    });
  }

  // -------------------- GUARDAR --------------------
  guardarHorario() {
    if (this.horarioForm.invalid) {
      this.horarioForm.markAllAsTouched();
      return;
    }

    const form = this.horarioForm.value;

    if (!form.id) {
      // Crear nuevo
      form.id = this.dataSource.data.length + 1;
      this.dataSource.data = [...this.dataSource.data, form];

    } else {
      // Editar
      const index = this.dataSource.data.findIndex(x => x.id === form.id);
      this.dataSource.data[index] = form;
      this.dataSource._updateChangeSubscription();
    }

    this.limpiarFormulario();
  }

  // -------------------- EDITAR --------------------
  editarHorario(row: any) {
    this.horarioForm.patchValue(row);

    window.scroll({
      top: 0,
      behavior: 'smooth'
    });
  }

  // -------------------- ELIMINAR --------------------
  eliminarHorario(row: any) {
    if (confirm('¿Estás seguro que deseas eliminar este horario?')) {
      this.dataSource.data = this.dataSource.data.filter(x => x.id !== row.id);
    }
  }

  // -------------------- FILTRO --------------------
  aplicarFiltro(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  // -------------------- LIMPIAR FORMULARIO --------------------
  limpiarFormulario() {
    this.horarioForm.reset({
      id: null,
      contador: 0,
      numVacante: 0,
      estado: 'Activo'
    });
  }

  // -------------------- OBTENER NOMBRES --------------------
  obtenerTurnoNombre(id: number) {
    return this.turnos.find(x => x.id === id)?.nombre || '';
  }

  obtenerDisciplinaNombre(id: number) {
    return this.disciplinas.find(x => x.id === id)?.nombre || '';
  }

  obtenerCategoriaNombre(id: number) {
    return this.categorias.find(x => x.id === id)?.nombre || '';
  }

  obtenerTemporadaDescripcion(id: number) {
    return this.temporadas.find(x => x.id === id)?.descripcion || '';
  }
}
