import { Component, inject, OnInit } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { CategoriaListaComponent } from "../categoria-lista/categoria-lista.component";
import { validarInput, ValidationType } from "../../../../util/validaciones.util";
import { CategoriaedadService } from "../../../../services/categoriaedad.service";
import { Categoriaedad } from "../../../../model/categoriaedad.model";

@Component({
  selector: "app-categoria-form",
  imports: [MaterialModule],
  templateUrl: "./categoria-form.component.html",
  styleUrl: "./categoria-form.component.css",
  providers: [DatePipe],
})
export class CategoriaFormComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private toastrService: ToastrService, private datePipe: DatePipe) {
    this.buildForm();
  }
  private categoriaService = inject(CategoriaedadService);
  private listaTemporada = inject(CategoriaListaComponent);

  categoriaForm: FormGroup;
  cargar = false;
  idCategoria = 0;

  private buildForm() {
    this.categoriaForm = this.formBuilder.group({
      descripcion: ["", [Validators.required, Validators.pattern("^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9- ]+$")]],
      edadminima: ["", Validators.required],
      edadmaxima: ["", Validators.required],
      estado: ["1", Validators.required],
    });
  }
  ngOnInit(): void {}
  editarCategoria(id: number) {
    this.idCategoria = Number(id);
    this.categoriaService.findById(Number(id)).subscribe({
      next: (data) => {
        this.categoriaForm.get("descripcion")?.setValue(data.descripcion),
          this.categoriaForm.get("edadminima")?.setValue(data.edadminima),
          this.categoriaForm.get("edadmaxima")?.setValue(data.edadmaxima);
        this.categoriaForm.get("estado")?.setValue(data.estado);
      },
      error: (error) => {
        this.cargar = false;
        this.toastrService.error(error.error.value[0].message, "Error al cargar datos", { timeOut: 3200 });
      },
    });
  }

  guardarCategoria(event: MouseEvent) {
    this.cargar = true;
    const categoria: Categoriaedad = {
      descripcion: String(this.categoriaForm.get("descripcion")?.value).trim(),
      edadminima: Number(this.categoriaForm.get("edadminima")?.value),
      edadmaxima: Number(this.categoriaForm.get("edadmaxima")?.value),
      estado: String(this.categoriaForm.get("estado")?.value).trim(),
    };
    if (this.idCategoria !== 0) {
      this.categoriaService.update(this.idCategoria, categoria).subscribe({
        next: () => {
          this.toastrService.success("Se actualizaron los datos correctamente.", "Exitoso", { timeOut: 3200 });
          this.cargar = false;
          this.limpiarFormulario(event);
          this.listaTemporada.getAllCategoria();
        },
        error: (error) => {
          this.cargar = false;
          this.toastrService.error(error.error.value[0].message, "Error en actualizar", { timeOut: 3200 });
        },
      });
    } else {
      this.categoriaService.save(categoria).subscribe({
        next: () => {
          this.toastrService.success("Se guardaron los datos correctamente.", "Exitoso", { timeOut: 3200 });
          this.cargar = false;
          this.limpiarFormulario(event);
          this.listaTemporada.getAllCategoria();
        },
        error: (error) => {
          this.cargar = false;
          this.toastrService.error(error.error.value[0].message, "Error en guardar", { timeOut: 3200 });
        },
      });
    }
  }
  limpiarFormulario(e: MouseEvent) {
    e.preventDefault();
    this.cargar = false;
    this.categoriaForm.reset();
    this.categoriaForm.get("estado")?.setValue("1");
    this.idCategoria = 0;
  }

  soloNumeros(event: KeyboardEvent, type: ValidationType) {
    validarInput(event, type);
  }
}
