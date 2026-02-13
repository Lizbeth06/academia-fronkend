import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";

import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MaterialModule } from "../../../../material/material.module";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-horarios-lista",
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: "./horarios-lista.component.html",
  styleUrl: "./horarios-lista.component.css",
})
export class HorariosListaComponent implements OnInit {
  horarioForm!: FormGroup;

  displayedColumns: string[] = ["turno", "disciplina", "categoria", "temporada", "contador", "vacantes", "estado", "acciones"];

  dataSource = new MatTableDataSource<any>([]);

  // Datos simulados (reemplazar luego con API)

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

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
      const index = this.dataSource.data.findIndex((x) => x.id === form.id);
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
      behavior: "smooth",
    });
  }

  // -------------------- ELIMINAR --------------------
  eliminarHorario(row: any) {
    if (confirm("¿Estás seguro que deseas eliminar este horario?")) {
      this.dataSource.data = this.dataSource.data.filter((x) => x.id !== row.id);
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
      estado: "Activo",
    });
  }
}
