import { Component, inject } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Tipodocumento } from "../../../../model/tipodocumento";
import { Niveleducacion } from "../../../../model/niveleducacion";
import { Oficina } from "../../../../model/oficina";
import { Ubigeo } from "../../../../model/ubigeo.model";
import { Persona } from "../../../../model/persona";
import { TipodocumentoService } from "../../../../services/tipodocumento.service";
import { NiveleducacionService } from "../../../../services/niveleducacion.service";
import { OficinaService } from "../../../../services/oficina.service";
import { UbigeoService } from "../../../../services/ubigeo.service";
import { PersonaService } from "../../../../services/persona.service";

@Component({
  selector: "app-trabajador-form",
  imports: [MaterialModule],
  templateUrl: "./trabajador-form.component.html",
  styleUrl: "./trabajador-form.component.css",
})
export class TrabajadorFormComponent {
  form!: FormGroup;
  tipodocumento!: Tipodocumento[];
  niveleducacion!: Niveleducacion[];
  oficina!: Oficina[];
  paisesDirectivo!: Ubigeo[];
  departamentosDir!: Ubigeo[];
  provinciasDir!: Ubigeo[];
  distritosDir!: Ubigeo[];
  searchnumdocumento!: Persona[];
  genero = ["FEMENINO", "MASCULINO", "OTROS"];
  tipocontrato = ["TERCERO", "CAS", "NOMBRADO"];

  private tipodocumentoService = inject(TipodocumentoService);
  private niveleduacionService = inject(NiveleducacionService);
  private oficinaService = inject(OficinaService);
  private ubigeoService = inject(UbigeoService);
  private personaService = inject(PersonaService);

  ngOnInit(): void {
    this.initForm();

    this.tipodocumentoService.findAll().subscribe((data) => {
      this.tipodocumento = data.filter((tipo) => tipo.idTipoDocumento !== 3);
    });

    this.niveleduacionService.findAll().subscribe((data) => {
      this.niveleducacion = data;
    });

    this.oficinaService.findAll().subscribe((data) => {
      this.oficina = data;
    });

    this.ubigeoService.findAllDepartments().subscribe((data) => {
      this.departamentosDir = data;
    });
  }

  initForm() {
    this.form = new FormGroup({
      tipodocumento: new FormControl(3, Validators.required),
      numDocumento: new FormControl("", Validators.required),
      nombres: new FormControl("", Validators.required),
      apaterno: new FormControl("", Validators.required),
      amaterno: new FormControl("", Validators.required),
      genero: new FormControl(""),
      iddistrito: new FormControl(""),
      direccion: new FormControl(""),
      fNacimiento: new FormControl(""),

      cargo: new FormControl(""),
      codigoTrabajador: new FormControl(""),
      fingreso: new FormControl(""),
      fsalida: new FormControl(""),
      tipocontrato: new FormControl(""),
      horariotrabajo: new FormControl(""),
      salario: new FormControl(""),
      metas: new FormControl(""),
      observaciones: new FormControl(""),
      bonificaciones: new FormControl(""),
      linkedin: new FormControl(""),
      niveleducacion: new FormControl(""),
      oficina: new FormControl(""),
      urlFoto: new FormControl(null),

      idepartamento: new FormControl(""),
      idprovincia: new FormControl(""),
    });
  }

  operate() {}

  //Funciones para optener provincia a partir de departamento
  obtenerProvinciasDir() {
    const idDepartamento = this.form.value["idepartamento"];
    idDepartamento && this.ubigeoService.findProvincias(idDepartamento).subscribe((data) => (this.provinciasDir = data));
  }

  //Funciones para optener provincia a partir de departamento
  obtenerDistritosDir() {
    const idDepartamento = this.form.value["idepartamento"];
    const idProvincia = this.form.value["idprovincia"];

    idDepartamento && idProvincia && this.ubigeoService.findDistritos(idDepartamento, idProvincia).subscribe((data) => (this.distritosDir = data));
  }

  //Funciones para optener provincia a partir de departamento
  buscarxDoc() {
    const numdocumento = this.form.value["numDocumento"];
    const tipodocumento = this.form.value["tipodocumento"];
    numdocumento &&
      tipodocumento &&
      this.personaService.findTipodocByNumdoc(tipodocumento, numdocumento).subscribe(
        (data) => {
          if (data && data.length > 0) {
            this.searchnumdocumento = data;
            this.form.patchValue({
              nombres: this.searchnumdocumento[0].nombres,
              apaterno: this.searchnumdocumento[0].apaterno,
              amaterno: this.searchnumdocumento[0].amaterno,
            });
          }
        },
        (error) => {
          console.error("Error al buscar documento:", error);
        }
      );
  }
}
