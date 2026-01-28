import { Component, inject, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MaterialModule } from "../../../../material/material.module";
import { validarInput, ValidationType } from "../../../../util/validaciones.util";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { PaginatorService } from "../../../../services/security/paginator.service";
import { Router, RouterLink } from "@angular/router";
import { InscripcionService } from "../../../../services/inscripcion.service";
import { Inscripcion } from "../../../../model/inscripcion.model";
import { Participante } from "../../../../model/participante.model";
import { calcularEdad } from "../../../../util/calculos.util";
import { DataService } from "../../../../services/data.service";

@Component({
  selector: "app-validacioninscripcion",
  standalone: true,
  imports: [CommonModule, MatTableModule, MaterialModule],
  templateUrl: "./validacioninscripcion-lista.component.html",
  styleUrl: "./validacioninscripcion-lista.component.css",
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorService }],
})
export class ValidacioninscripcionListaComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.buildForm();
  }
  private inscripcionService = inject(InscripcionService);
  private dataService = inject(DataService);

  filtroForm: FormGroup;
  participante: Inscripcion[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  buildForm() {
    this.filtroForm = this.fb.group({
      nroRegistro: [""],
      dni: ["", [Validators.pattern(/^\d{8}$/)]],
    });
  }

  displayedColumns = ["nroRegistro", "nombre", "deporte", "modalidad", "etapa", "complejo", "edad", "estado", "accion"];

  dataSource = new MatTableDataSource<Inscripcion>();

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
    let encontrado: Inscripcion | undefined;
    if (this.dataSource.data.length <= 1) {
      this.dataSource.data = this.participante;
    }
    if (nroRegistro) {
      encontrado = this.dataSource.data.find((p) => p.idInscripcion == nroRegistro);
    } else if (dni) {
      encontrado = this.dataSource.data.find((p) => p.apoderadoparticipante.participante.persona.numDocumento === dni);
    }
    this.dataSource.data = encontrado ? [encontrado] : [];
  }

  changeBusqueda() {
    const { nroRegistro, dni } = this.filtroForm.value;
    if (nroRegistro === "" && dni === "") {
      this.dataSource.data = this.participante;
    }
  }

  getAllPreinscrito() {
    this.inscripcionService.findAll().subscribe({
      next: (data) => {
        this.participante = data;
        this.crearTabla(data);
      },
    });
  }
  crearTabla(data: Inscripcion[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  mostrarPreinscrito(idInscripcion: string) {
    this.dataService.sendData(idInscripcion);
    this.router.navigate(["/admin/inscripcion/validacioninscripcion/validando"]);
  }

  nombreParticipante(row: Participante): string {
    return `${row.persona.apaterno} ${row.persona.amaterno} ${row.persona.nombres}`;
  }

  obtenerEdad(fechaNacimiento: Date) {
    return calcularEdad(fechaNacimiento);
  }

  soloNumeros(event: KeyboardEvent, type: ValidationType) {
    validarInput(event, type);
  }
}
