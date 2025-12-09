import { Component, inject, OnInit } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AnioService } from "../../../../services/anio.service";
import { Anio } from "../../../../model/anio.model";
import { Temporada } from "../../../../model/temporada.model";
import { DatePipe } from "@angular/common";
import { TemporadaService } from "../../../../services/temporada.service";
import { ToastrService } from "ngx-toastr";
import { TemporadaListaComponent } from "../temporada-lista/temporada-lista.component";

@Component({
  selector: "app-temporada-form",
  imports: [MaterialModule],
  templateUrl: "./temporada-form.component.html",
  styleUrl: "./temporada-form.component.css",
  providers: [DatePipe],
})
export class TemporadaFormComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private toastrService: ToastrService, private datePipe: DatePipe) {
    this.buildForm();
  }
  private anioService = inject(AnioService);
  private temporadaService = inject(TemporadaService);
  private listaTemporada = inject(TemporadaListaComponent);

  anios: Anio[] = [];
  temporadaForm: FormGroup;
  cargar = false;
  idTemporada = 0;

  private buildForm() {
    this.temporadaForm = this.formBuilder.group({
      anio: [1, Validators.required],
      descripcion: ["", [Validators.required, Validators.pattern("^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9- ]+$")]],
      faperturainscripcion: ["", Validators.required],
      finicioclase: ["", Validators.required],
      fcierreclase: ["", Validators.required],
      fcierreinscripcion: ["", Validators.required],
      estado: ["1", Validators.required],
    });
  }
  ngOnInit(): void {
    this.anioService.findAll().subscribe((data) => (this.anios = data));
  }
  editarTemporada(id: number) {
    this.idTemporada = Number(id);
    this.temporadaService.findById(Number(id)).subscribe({
      next: (data) => {
        this.temporadaForm.get("descripcion")?.setValue(data.descripcion),
          this.temporadaForm.get("anio")?.setValue(data.anio.idAnio),
          this.temporadaForm.get("faperturainscripcion")?.setValue(data.faperturainscripcion);
        this.temporadaForm.get("fcierreinscripcion")?.setValue(data.faperturainscripcion);
        this.temporadaForm.get("finicioclase")?.setValue(data.finicioclases);
        this.temporadaForm.get("fcierreclase")?.setValue(data.fcierreclases);
        this.temporadaForm.get("estado")?.setValue(data.estado);
      },
      error: (error) => {
        this.cargar = false;
        this.toastrService.error(error.error.value[0].message, "Error al cargar datos", { timeOut: 3200 });
      },
    });
  }

  guardarTemporada(event: MouseEvent) {
    this.cargar = true;
    const temporada: Temporada = {
      descripcion: String(this.temporadaForm.get("descripcion")?.value).trim(),
      faperturainscripcion: String(this.datePipe.transform(this.temporadaForm.get("faperturainscripcion")?.value, "yyyy-MM-ddT00:00:00")).trim(),
      finicioclases: String(this.datePipe.transform(this.temporadaForm.get("finicioclase")?.value, "yyyy-MM-ddT00:00:00")).trim(),
      fcierreclases: String(this.datePipe.transform(this.temporadaForm.get("fcierreclase")?.value, "yyyy-MM-ddT00:00:00")).trim(),
      fcierreinscripcion: String(this.datePipe.transform(this.temporadaForm.get("fcierreinscripcion")?.value, "yyyy-MM-ddT00:00:00")).trim(),
      fregistro: String(this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")).trim(),
      estado: String(this.temporadaForm.get("estado")?.value).trim(),
      anio: { idAnio: Number(this.temporadaForm.get("anio")?.value) },
    };
    if (this.idTemporada !== 0) {
      this.temporadaService.update(this.idTemporada, temporada).subscribe({
        next: () => {
          this.toastrService.success("Se actualizaron los datos correctamente.", "Exitoso", { timeOut: 3200 });
          this.cargar = false;
          this.limpiarFormulario(event);
          this.listaTemporada.getAllTemporada();
        },
        error: (error) => {
          this.cargar = false;
          this.toastrService.error(error.error.value[0].message, "Error en actualizar", { timeOut: 3200 });
        },
      });
    } else {
      this.temporadaService.save(temporada).subscribe({
        next: () => {
          this.toastrService.success("Se guardaron los datos correctamente.", "Exitoso", { timeOut: 3200 });
          this.cargar = false;
          this.limpiarFormulario(event);
          this.listaTemporada.getAllTemporada();
        },
        error: (error) => {
          this.cargar = false;
          this.toastrService.error(error.error.value[0].message, "Error en guardar", { timeOut: 3200 });
        },
      });
    }
  }
  limpiarFormulario(e: MouseEvent) {
    this.cargar = false;
    e.preventDefault();
    this.temporadaForm.reset();
    this.temporadaForm.get("anio")?.setValue(1);
    this.temporadaForm.get("estado")?.setValue("1");
    this.idTemporada = 0;
  }
}
