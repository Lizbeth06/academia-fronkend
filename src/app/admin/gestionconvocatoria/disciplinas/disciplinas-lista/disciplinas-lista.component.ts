import { Component, inject, Inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";

import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MaterialModule } from "../../../../material/material.module";
import { MatDialogRef } from "@angular/material/dialog";
import { DialogcustomComponent } from "../../../dialogcustom/dialogcustom.component";
import { DialogService } from "../../../../services/dialog/dialog.service";
import { Disciplina } from "../../../../model/disciplina.model";
import { DisciplinasFormComponent } from "../disciplinas-form/disciplinas-form.component";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DisciplinaService } from "../../../../services/disciplina.service";

@Component({
  selector: "app-disciplinas-lista",
  standalone: true,
  imports: [CommonModule, MaterialModule, DisciplinasFormComponent],
  templateUrl: "./disciplinas-lista.component.html",
  styleUrl: "./disciplinas-lista.component.css",
})
export class DisciplinasListaComponent implements OnInit {
  constructor(
    private formBuild: FormBuilder,
    private dialogService: DialogService,
  ) {
    this.buildForm();
  }

  private matDialogRef!: MatDialogRef<DialogcustomComponent>;

  private disciplinaService = inject(DisciplinaService);

  dataDisciplina?: Disciplina;
  disciplinaForm: FormGroup;
  dataSource!: MatTableDataSource<Disciplina>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  buildForm() {
    this.disciplinaForm = this.formBuild.group({
      id: [null],
      codigo: ["", Validators.required],
      descripcion: ["", Validators.required],
      estado: ["Activo", Validators.required],
      fechaRegistro: [""],
    });
  }

  displayedColumns = ["codigo", "descripcion", "estado", "acciones"];

  ngOnInit(): void {
    this.getAllDisciplina();
  }

  getAllDisciplina() {
    this.disciplinaService.findAll().subscribe((data) => {
      this.crearTabla(data);
    });
  }

  crearTabla(data: Disciplina[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  guardar() {
    this.limpiar();
  }

  limpiar() {
    this.disciplinaForm.reset({
      id: null,
      estado: "Activo",
    });
  }

  editar(row: any) {
    this.disciplinaForm.patchValue(row);
    window.scroll({ top: 0, behavior: "smooth" });
  }

  eliminar(row: any) {}
  modalDisciplina(template: TemplateRef<any>, dataDisciplina?: Disciplina) {
    this.dataDisciplina = dataDisciplina;
    this.matDialogRef = this.dialogService.openDialogCustom({
      template,
      data: {
        listaverHorario: this.dataDisciplina,
      },
    });
  }

  aplicarFiltro(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }
}
