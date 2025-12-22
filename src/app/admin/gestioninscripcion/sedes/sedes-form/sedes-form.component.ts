import { Component, effect, inject, input, linkedSignal, output, signal, Signal, untracked } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { UbigeoService } from "../../../../services/ubigeo.service";
import { Ubigeo } from "../../../../model/ubigeo.model";
import { SectorService } from "../../../../services/sector.service";
import { Sector, Sede } from "../../../../model/sede.model";
import { MapComponent } from "../../../../common/components/map/map.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-sedes-form",
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatIconModule, ReactiveFormsModule, MatButtonModule, MapComponent],
  templateUrl: "./sedes-form.component.html",
  styleUrl: "./sedes-form.component.css",
})
export class SedesFormComponent {
  //inputs
  readonly sedeActual = input<Sede>();

  //outupts
  readonly registrar = output<Sede>();
  readonly cancelar = output();

  // Servicios
  ubigeoService = inject(UbigeoService);
  sectorService = inject(SectorService);
  toastrService = inject(ToastrService);

  // Datos
  departamentos: Ubigeo[] = [];
  provincias: Ubigeo[] = [];
  distritos: Ubigeo[] = [];
  sectores: Sector[] = [];
  coordenada = signal<{ lat: number; lng: number }>({
    lat: -12.0464,
    lng: -77.0428,
  });

  fb = inject(FormBuilder);
  sedeForm = this.fb.group({
    nombre: ["", Validators.required],
    id_sector: [1, Validators.required],
    ubiDpto: ["", Validators.required],
    ubiProvincia: ["", Validators.required],
    idUbigeo: [<number | undefined>undefined, Validators.required],
    direccion: ["", Validators.required],
    lat: [{ value: this.coordenada().lat, disabled: true }, Validators.required],
    lng: [{ value: this.coordenada().lat, disabled: true }, Validators.required],
    capacidad: [0, [Validators.min(0)]],
    estado: [1, Validators.required],
  });

  constructor() {
    effect(() => {
      this.sedeActual();
      untracked(() => {
        this.coordenada.set({
          lat: this.sedeActual()?.latitud ?? -12.0464,
          lng: this.sedeActual()?.longitud ?? -77.0428,
        });
      });
      if (this.sedeActual()) {
        this.llenarFormulario();
      } else {
        this.limpiarFormulario();
      }
    });

    effect(() => {
      this.coordenada();
      this.sedeForm.patchValue({
        lat: this.coordenada().lat,
        lng: this.coordenada().lng,
      });
    });
  }

  ngOnInit() {
    this.cargarDatos();
    if (this.sedeActual()) this.llenarFormulario();
  }

  // Cargando datos
  cargarDatos() {
    // Departamentos
    this.ubigeoService.findAllDepartments().subscribe((data) => {
      this.departamentos = data;
    });
    // Secores
    this.sectorService.findAll().subscribe((data) => {
      this.sectores = data;
    });
  }

  llenarFormulario() {
    this.sedeForm.patchValue({
      nombre: this.sedeActual()?.nombre,
      id_sector: this.sedeActual()?.sector!.idSector!,
      direccion: this.sedeActual()?.direccion,
      capacidad: this.sedeActual()?.capacidad,
      estado: this.sedeActual()?.estado,
    });
    this.ubigeoService.findById(this.sedeActual()?.codubi!).subscribe((data) => {
      this.sedeForm.patchValue({
        ubiDpto: data.ubiDpto,
        ubiProvincia: data.ubiProvincia,
        idUbigeo: data.idUbigeo,
      });
      this.ubigeoService.findProvincias(data.ubiDpto!).subscribe((data) => {
        this.provincias = data;
      });
      this.ubigeoService.findDistritos(data.ubiDpto!, data.ubiProvincia!).subscribe((data) => {
        this.distritos = data;
      });
    });
  }

  confirmarRegistro(): void {
    if (this.sedeForm.invalid) {
      this.sedeForm.markAllAsTouched();
      return;
    }
    const formValue = this.sedeForm.value;
    const ubicacion = `${this.departamentos.find((dep) => dep.ubiDpto == formValue.ubiDpto)?.ubiNombre}/${
      this.provincias.find((prov) => prov.ubiDpto == formValue.ubiDpto)?.ubiNombre
    }/${this.distritos.find((dis) => dis.idUbigeo == formValue.idUbigeo)?.ubiNombre}`;
    const datos: Sede = {
      idSede: this.sedeActual()?.idSede,
      nombre: formValue.nombre!.toUpperCase(),
      codubi: formValue.idUbigeo!,
      direccion: formValue.direccion!.toUpperCase(),
      capacidad: formValue.capacidad!,
      ubicacion: ubicacion,
      latitud: this.coordenada().lat,
      longitud: this.coordenada().lng,
      estado: formValue.estado!,
      sector: {
        idSector: formValue.id_sector!,
      } as Sector,
    };
    this.limpiarFormulario();
    this.registrar.emit(datos);
  }

  cancelarRegistro() {
    this.limpiarFormulario();
    this.cancelar.emit();
  }

  limpiarFormulario(): void {
    this.sedeForm.reset({
      nombre: "",
      id_sector: 1,
      ubiDpto: "",
      ubiProvincia: "",
      idUbigeo: undefined,
      direccion: "",
      capacidad: 0,
      estado: 1,
    });
    this.provincias = [];
    this.distritos = [];
  }

  seleccionarDepartamento() {
    this.ubigeoService.findProvincias(this.sedeForm.getRawValue().ubiDpto!).subscribe((data) => {
      this.provincias = data;
    });
    this.provincias = [];
    this.distritos = [];
    this.sedeForm.get("ubiProvincia")?.patchValue("");
    this.sedeForm.get("idUbigeo")?.patchValue(0);
  }

  seleccionarProvincia() {
    this.ubigeoService.findDistritos(this.sedeForm.getRawValue().ubiDpto!, this.sedeForm.getRawValue().ubiProvincia!).subscribe((data) => {
      this.distritos = data;
    });
    this.distritos = [];
    this.sedeForm.get("idUbigeo")?.patchValue(0);
  }
}
