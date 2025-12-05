import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../../../material/material.module';


@Component({
  selector: 'app-validacioninscripcion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MaterialModule
  ],
  templateUrl: './validacioninscripcion-lista.component.html',
  styleUrl: './validacioninscripcion-lista.component.css'
})
export class ValidacioninscripcionListaComponent {

  registroForm: FormGroup;
  filtroForm: FormGroup;
  participante: any = null;

  displayedColumns = [
    "nroRegistro",
    "nombre",
    "deporte",
    "modalidad",
    "etapa",
    "complejo",
    "edad",
    "estado"
  ];

  dataSource = new MatTableDataSource<any>([]);


  BD = [
    {
      nroRegistro: "2025-001",
      dni: "72649281",
      nombre: "Ana Lucía",
      apPaterno: "Vargas",
      apMaterno: "Huamán",
      edad: 13,
      deporte: "Karate",
      modalidad: "Competitiva",
      etapa: "Preinscripción",
      complejo: "Videna",
      estado: "Pendiente",
      horario: "Mañana"
    }
  ];

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({ nroRegistro: [''] });
    this.filtroForm = this.fb.group({ dni: [''] });
  }

  buscarRegistro() {
    const nro = this.registroForm.value.nroRegistro;
    this.participante = this.BD.find(p => p.nroRegistro === nro) || null;
  }

  buscarAvanzado() {
  const dni = this.filtroForm.value.dni;

  const resultados = this.BD.filter(x => x.dni.includes(dni));

  this.dataSource = new MatTableDataSource(resultados);
}
}
