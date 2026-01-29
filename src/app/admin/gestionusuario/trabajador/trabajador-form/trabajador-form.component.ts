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
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TrabajadorService } from "../../../../services/trabajador.service";
import { Trabajador } from '../../../../model/trabajador';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-trabajador-form",
  imports: [MaterialModule],
  templateUrl: "./trabajador-form.component.html",
  styleUrl: "./trabajador-form.component.css",
})
export class TrabajadorFormComponent {
  readonly dialogRef = inject(MatDialogRef<TrabajadorFormComponent>);
  id = inject<number | undefined>(MAT_DIALOG_DATA);
  idPersona: number | undefined;

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

  //estados
  buscando = false;

  private trabajadorService = inject(TrabajadorService);
  private tipodocumentoService = inject(TipodocumentoService);
  private niveleduacionService = inject(NiveleducacionService);
  private oficinaService = inject(OficinaService);
  private ubigeoService = inject(UbigeoService);
  private personaService = inject(PersonaService);
  private toastrService = inject(ToastrService);

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

    this.ubigeoService.getAllDepartments().subscribe((data) => {
      this.departamentosDir = data;
    });

    this.id && this.trabajadorService.findById(this.id).subscribe((data) => {
      this.idPersona = data.persona.idPersona;
      this.updateForm(data);
      this.updateDepartamentoAndProvincia();
    });
  }

  initForm() {
    this.form = new FormGroup({
      tipodocumento: new FormControl(3, Validators.required),
      numDocumento: new FormControl("", [Validators.required, Validators.minLength(8)]),
      nombres: new FormControl("", Validators.required),
      apaterno: new FormControl("", Validators.required),
      amaterno: new FormControl("", Validators.required),
      genero: new FormControl(1),
      idDistrito: new FormControl(<number | undefined>undefined),
      direccion: new FormControl(""),
      fNacimiento: new FormControl(<Date | undefined>undefined),
      cargo: new FormControl(""),
      codigoTrabajador: new FormControl(""),
      fingreso: new FormControl(<Date | undefined>undefined),
      fsalida: new FormControl(<Date | undefined>undefined),
      tipocontrato: new FormControl(""),
      horariotrabajo: new FormControl(""),
      salario: new FormControl(<number | undefined>undefined),
      metas: new FormControl(""),
      observaciones: new FormControl(""),
      bonificaciones: new FormControl(""),
      linkedin: new FormControl(""),
      niveleducacion: new FormControl(""),
      oficina: new FormControl(""),
      urlFoto: new FormControl(<string | undefined>undefined),
      idDepartamento: new FormControl(<string | undefined>undefined),
      idProvincia: new FormControl(<string | undefined>undefined),
    });
  }

  updateForm(trabajador: Trabajador) {
    this.form.patchValue({
      tipodocumento: trabajador.persona.tipodocumento.idTipoDocumento,
      numDocumento: trabajador.persona.numDocumento,
      nombres: trabajador.persona.nombres,
      apaterno: trabajador.persona.apaterno,
      amaterno: trabajador.persona.amaterno,
      genero: trabajador.persona.genero,
      idDistrito: trabajador.persona.ubigeo.idUbigeo,
      direccion: trabajador.persona.direccion,
      fNacimiento: trabajador.persona.fnacimiento,
      cargo: trabajador.cargo,
      codigoTrabajador: trabajador.codigoTrabajador,
      fingreso: trabajador.fingreso,
      fsalida: trabajador.fsalida,
      tipocontrato: trabajador.tipocontrato,
      horariotrabajo: trabajador.horariotrabajo,
      salario: trabajador.salario,
      metas: trabajador.metas,
      observaciones: trabajador.observaciones,
      bonificaciones: trabajador.bonificaciones,
      linkedin: trabajador.persona.urllinkeding,
      niveleducacion: trabajador.niveleducacion.idNivelEducacion,
      oficina: trabajador.oficina.idOficina,
      urlFoto: trabajador.persona.urlFoto,
      idDepartamento: trabajador.persona.ubigeo.ubiDpto,
      idProvincia: trabajador.persona.ubigeo.ubiProvincia,
    });
  }

  operate() { }

  //Funciones para optener provincia a partir de departamento
  seleccionarDepartamento() {
    console.log("departamento seleccionado");
    const idDepartamento = this.form.value["idDepartamento"];
    console.log(idDepartamento);
    idDepartamento && this.ubigeoService.findProvincias(idDepartamento).subscribe((data) => {
      this.provinciasDir = data;
      this.form.get('idProvincia')?.setValue(undefined);
      this.form.get('idDistrito')?.setValue(undefined);
    });
  }

  //Funciones para optener distrito a partir de provincia
  seleccionarProvincia() {
    const idDepartamento = this.form.value["idDepartamento"];
    const idProvincia = this.form.value["idProvincia"];
    idDepartamento && idProvincia && this.ubigeoService.findDistritos(idDepartamento, idProvincia).subscribe((data) => {
      this.distritosDir = data;
      this.form.get('idDistrito')?.setValue(undefined);
    });
  }

  updateDepartamentoAndProvincia() {
    const idDepartamento = this.form.value["idDepartamento"];
    const idProvincia = this.form.value["idProvincia"];
    const idDistrito = this.form.value["idDistrito"];
    idDepartamento && idProvincia && idDistrito &&
      this.ubigeoService.findProvincias(idDepartamento).subscribe((data) => {
        this.provinciasDir = data;
        this.ubigeoService.findDistritos(idDepartamento, idProvincia).subscribe((data) => {
          this.distritosDir = data;
        });
      });

    console.log(idDistrito);
  }

  //Funciones para optener provincia a partir de departamento
  buscarxDoc() {
    this.buscando = true;

    const numdocumento = this.form.value["numDocumento"];
    const tipodocumento = this.form.value["tipodocumento"];
    if (numdocumento && tipodocumento) {
      this.trabajadorService.findByDocumento(tipodocumento, numdocumento).subscribe({
        next: (data) => {
          if (data) {
            this.id = data.idTrabajador;
            this.idPersona = data.persona.idPersona;
            this.updateForm(data);
            this.updateDepartamentoAndProvincia();
          }
          this.buscando = false;
        },
        error: (error) => {
          this.personaService.findByDocumento(tipodocumento, numdocumento).subscribe({
            next: (data) => {
              if (data) {
                this.idPersona = data.idPersona;
                this.form.patchValue({
                  nombres: data.nombres,
                  apaterno: data.apaterno,
                  amaterno: data.amaterno,
                });
              }
              this.buscando = false;
            },
            error: (error) => {
              console.error("Error al buscar documento:", error);
              this.buscando = false;
            }
          });
        }
      });
    }
  }

  //Persistenccia de datos
  save() {
    const trabajador = {
      idTrabajador: this.id,
      codigoTrabajador: this.form.get('codigoTrabajador')?.value,
      cargo: this.form.get('cargo')?.value,
      fingreso: this.form.get('fingreso')?.value,
      fsalida: this.form.get('fsalida')?.value,
      tipocontrato: this.form.get('tipocontrato')?.value,
      horariotrabajo: this.form.get('horariotrabajo')?.value,
      salario: this.form.get('salario')?.value,
      metas: this.form.get('metas')?.value,
      observaciones: this.form.get('observaciones')?.value,
      bonificaciones: this.form.get('bonificaciones')?.value,
      persona: {
        idPersona: this.idPersona,
        numDocumento: this.form.get('numDocumento')?.value,
        nombres: this.form.get('nombres')?.value,
        apaterno: this.form.get('apaterno')?.value,
        amaterno: this.form.get('amaterno')?.value,
        genero: this.form.get('genero')?.value,
        correo: this.form.get('')?.value,
        telefono: this.form.get('')?.value,
        direccion: this.form.get('direccion')?.value,
        urllinkeding: this.form.get('linkedin')?.value,
        fnacimiento: this.form.get('fNacimiento')?.value,
        urlFoto: this.form.get('urlFoto')?.value,
        tipodocumento: {
          idTipoDocumento: this.form.get('tipodocumento')?.value
        } as Tipodocumento,
        ubigeo: {
          idUbigeo: this.form.get('idDistrito')?.value
        } as Ubigeo,
      } as Persona,
      niveleducacion: {
        idNivelEducacion: this.form.get('niveleducacion')?.value
      } as Niveleducacion,
      oficina: {
        idOficina: this.form.get('oficina')?.value
      } as Oficina,
      isActive: 1
    } as Trabajador;

    if (this.id) {
      this.trabajadorService.update(this.id!, trabajador).subscribe({
        next: (data) => {
          this.toastrService.success('Trabajador registrado correctamente.', 'Exitoso', { timeOut: 3200 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.toastrService.error(error.error.value[0].message, 'Error al registrar el trabajador', { timeOut: 3200 });
        }
      });
    } else {
      this.trabajadorService.save(trabajador).subscribe({
        next: (data) => {
          this.toastrService.success('Trabajador registrado correctamente.', 'Exitoso', { timeOut: 3200 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.toastrService.error(error.error.value[0].message, 'Error al registrar el trabajador', { timeOut: 3200 });
        }
      });
    }
  }
}
