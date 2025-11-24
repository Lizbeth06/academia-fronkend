import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material/material.module';

@Component({
  selector: 'app-turno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './turnos-lista.component.html',
  styleUrls: ['./turnos-lista.component.css']
})
export class TurnosListaComponent {

  turnoForm: FormGroup;

  displayedColumns = [
    'id',
    'horario',
    'hora_inicio',
    'hora_fin',
    'acciones'
  ];

  dataSource = new MatTableDataSource<any>([]);

  // Datos simulados para horarios
  horarios = [
    { id: 1, descripcion: 'Mañana' },
    { id: 2, descripcion: 'Tarde' },
    { id: 3, descripcion: 'Noche' }
  ];

  constructor(private fb: FormBuilder) {
    this.turnoForm = this.fb.group({
      id: [null],
      id_horario: [null, Validators.required],
      hora_inicio: ['', Validators.required],
      hora_fin: ['', Validators.required]
    });
  }

  guardarTurno() {
    if (this.turnoForm.invalid) {
      this.turnoForm.markAllAsTouched();
      return;
    }

    const form = this.turnoForm.value;

    if (!form.id) {
      form.id = this.dataSource.data.length + 1;
      this.dataSource.data = [...this.dataSource.data, form];
    } else {
      const idx = this.dataSource.data.findIndex(t => t.id === form.id);
      this.dataSource.data[idx] = form;
      this.dataSource._updateChangeSubscription();
    }

    this.limpiarFormulario();
  }

  editarTurno(row: any) {
    this.turnoForm.patchValue(row);
    window.scroll({ top: 0, behavior: 'smooth' });
  }

  eliminarTurno(row: any) {
    this.dataSource.data = this.dataSource.data.filter(t => t.id !== row.id);
  }

  limpiarFormulario() {
    this.turnoForm.reset({
      id: null
    });
  }

  aplicarFiltro(v: string) {
    this.dataSource.filter = v.trim().toLowerCase();
  }

  obtenerHorarioDescripcion(id: number) {
    return this.horarios.find(h => h.id === id)?.descripcion || '';
  }
}
