import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { DataSource } from '@angular/cdk/table';

// ⭐️ FORMATO PERSONALIZADO DD/MM/YYYY
export const FORMATO_DDMMYYYY = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-temporada-lista',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIcon,
],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
    { provide: MAT_DATE_FORMATS, useValue: FORMATO_DDMMYYYY }
  ],
  templateUrl: './temporada-lista.component.html',
  styleUrl: './temporada-lista.component.css'
})
export class TemporadaListaComponent implements OnInit {

  temporadaForm: FormGroup;

  // años disponibles
  anios: number[] = [2024, 2025, 2026, 2027, 2028];

  // datos simulados
  temporadas: any[] = [];
  filteredTemporadas: any[] = [];

  constructor(private fb: FormBuilder, private adapter: DateAdapter<any>) {

    // ⭐ Forzar formato dd/MM/yyyy
    this.adapter.setLocale('es-PE');

    this.temporadaForm = this.fb.group({
      id: [null],
      anio: [null, Validators.required],
      descripcion: ['', Validators.required],
      fechaAperturaInscripcion: [null, Validators.required],
      fechaInicioClases: [null, Validators.required],
      fechaCierreClases: [null, Validators.required],
      fechaCierreInscripcion: [null, Validators.required],
      estado: ['En curso', Validators.required]
    });
  }

  ngOnInit(): void {
    // Si las temporadas se cargan aquí, asegurarse de llamar updateFiltered() después:
    // this.cargarTemporadas();  <-- ejemplo
  }

  updateFiltered(): void {
    this.filteredTemporadas = Array.isArray(this.temporadas) ? [...this.temporadas] : [];
  }

  aplicarFiltro(value: string): void {
    const filter = (value || '').toString().trim().toLowerCase();
    if (!filter) {
      this.filteredTemporadas = [...this.temporadas];
      return;
    }
    this.filteredTemporadas = (this.temporadas || []).filter(t => {
      // Buscar en todos los valores del objeto temporada
      return Object.values(t).some(v => {
        if (v === null || v === undefined) return false;
        const s = (v instanceof Date) ? (v as Date).toISOString() : String(v);
        return s.toLowerCase().includes(filter);
      });
    });
  }

  guardarTemporada(): void {
    if (this.temporadaForm.invalid) {
      this.temporadaForm.markAllAsTouched();
      return;
    }

    const formValue = this.temporadaForm.value;

    // Validar solo 1 temporada por año (excepto edición)
    const existeMismoAnio = this.temporadas.some(
      t => t.anio === formValue.anio && t.id !== formValue.id
    );

    if (existeMismoAnio) {
      alert('Ya existe una temporada para este año.');
      return;
    }

    if (formValue.id) {
      // Editar
      const index = this.temporadas.findIndex(t => t.id === formValue.id);
      if (index !== -1) {
        this.temporadas[index] = { ...this.temporadas[index], ...formValue };
      }
    } else {
      // Nueva
      const nuevoId = this.temporadas.length
        ? Math.max(...this.temporadas.map(t => t.id)) + 1
        : 1;

      this.temporadas.push({
        ...formValue,
        id: nuevoId
      });
    }

    this.updateFiltered();
    this.limpiarFormulario();
  }

  editarTemporada(temp: any): void {
    this.temporadaForm.patchValue(temp);
    window.scroll({ top: 0, behavior: 'smooth' });
  }

  eliminarTemporada(temp: any): void {
  const confirmar = confirm(`¿Eliminar la temporada ${temp.descripcion} (${temp.anio})?`);

  if (!confirmar) return;

  this.temporadas = this.temporadas.filter(t => t.id !== temp.id);
  this.updateFiltered();
}


  limpiarFormulario(): void {
    this.temporadaForm.reset({
      id: null,
      anio: null,
      descripcion: '',
      fechaAperturaInscripcion: null,
      fechaInicioClases: null,
      fechaCierreClases: null,
      fechaCierreInscripcion: null,
      estado: 'En curso'
    });
  }


}
