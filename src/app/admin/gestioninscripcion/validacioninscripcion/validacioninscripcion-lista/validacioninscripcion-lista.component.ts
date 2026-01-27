import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MaterialModule } from "../../../../material/material.module";
import { validarInput, ValidationType } from "../../../../util/validaciones.util";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { PaginatorService } from "../../../../services/security/paginator.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-validacioninscripcion",
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: "./validacioninscripcion-lista.component.html",
  styleUrl: "./validacioninscripcion-lista.component.css",
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorService }],
})
export class ValidacioninscripcionListaComponent implements OnInit {
  constructor(private fb: FormBuilder) {
    this.buildForm();
  }
  filtroForm: FormGroup;
  participante: any = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  buildForm() {
    this.filtroForm = this.fb.group({
      nroRegistro: [""],
      dni: ["", [Validators.pattern(/^\d{8}$/)]],
    });
  }

  displayedColumns = ["nroRegistro", "nombre", "deporte", "modalidad", "etapa", "complejo", "edad", "estado", "accion"];

  dataSource = new MatTableDataSource<any>();

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
      horario: "Mañana",
    },
  ];

  ngOnInit(): void {
    this.getAllPreinscrito();
    this.filtroForm.get("nroRegistro")?.valueChanges.subscribe((value) => {
      const dniControl = this.filtroForm.get("dni");
      value ? dniControl?.disable({ emitEvent: false }) : dniControl?.enable({ emitEvent: false });
    });

    this.filtroForm.get("dni")?.valueChanges.subscribe((value) => {
      const nroControl = this.filtroForm.get("nroRegistro");
      value ? nroControl?.disable({ emitEvent: false }) : nroControl?.enable({ emitEvent: false });
    });
  }
  buscarRegistro() {
    const { nroRegistro, dni } = this.filtroForm.value;
    if (nroRegistro) {
      this.participante = this.BD.find((p) => p.nroRegistro === nroRegistro) || null;
    } else if (dni) {
      this.participante = this.BD.find((p) => p.dni === dni) || null;
    }
    this.dataSource.data = this.participante ? [this.participante] : [];
  }

  getAllPreinscrito() {
    this.dataSource.data = this.BD;
  }
  crearTabla(data: any[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  soloNumeros(event: KeyboardEvent, type: ValidationType) {
    validarInput(event, type);
  }
}
