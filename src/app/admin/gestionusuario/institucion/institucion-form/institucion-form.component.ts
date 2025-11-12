import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material/material.module';
import { Tipodocumento } from '../../../../model/tipodocumento';
import { Ubigeo } from '../../../../model/ubigeo';
import { Institucion } from '../../../../model/institucion';
import { Persona } from '../../../../model/persona';
import { TipodocumentoService } from '../../../../services/tipodocumento.service';
import { UbigeoService } from '../../../../services/ubigeo.service';
import { PersonaService } from '../../../../services/persona.service';
import { RucService } from '../../../../services/ruc.service';
import { InstitucionService } from '../../../../services/institucion.service';
import { validarInput, ValidationType } from '../../../../util/validaciones.util';



@Component({
  selector: 'app-institucion-form',
  imports: [MaterialModule, CommonModule],
  templateUrl: './institucion-form.component.html',
  styleUrl: './institucion-form.component.css'
})
export class InstitucionFormComponent {
  constructor(private formBuilder:FormBuilder){
    this.buildForm();
  }
  formInstitucion!: FormGroup;
  tipodocumento!: Tipodocumento[];
  ubigeo!: Ubigeo[];
  paisesDirectivo!:Ubigeo[];
  departamentosDir!:Ubigeo[];
  provinciasDir!:Ubigeo[];
  distritosDir!:Ubigeo[];
  searchnumdocumento!:Institucion[];
  persona!:Persona[];
  selectedLogo: string | null = null;
  

  private tipodocumentoService= inject(TipodocumentoService);
  private ubigeoService= inject(UbigeoService);
  private personaService= inject(PersonaService);
  private rucService= inject(RucService);
  private institucionService= inject(InstitucionService);
  

  private buildForm() {
    this.formInstitucion = this.formBuilder.group({
      tipodocumento: [3, Validators.required],
      numdocumento:  ['', [Validators.required,Validators.pattern(/^[0-9]{11}$/)]],
      nombrecomercial:['',Validators.required],
      razonsocial:  ['', Validators.required], 
      direccion:  ['', Validators.required],
      telefono:  ['',[Validators.pattern(/^\d{10}$/)]],
      celular:  ['',[Validators.required,Validators.pattern(/^\d{9}$/)]],
      correo: ['', Validators.email],
      igv:  [''],
      clavesol:  ['', Validators.required],
      usuariosol:  ['', Validators.required],
      urllogo:  [''],
      departamento: ['',Validators.required],
      provincia: ['',Validators.required],
      distrito: ['',Validators.required],

    });
  }
  ngOnInit() {
    
    this.tipodocumentoService.findAll().subscribe((data) => { 
      this.tipodocumento = data.filter(tipo => tipo.idTipoDocumento === 3);
    });

    this.ubigeoService.findAllDepartments().subscribe((data) => {
      this.departamentosDir = data;
    });
    
  }
  idInstitucion=0;
  onSave() {
    if (this.formInstitucion.valid) {
      if (this.idInstitucion) {
        // this.updateInstitucion();
      }else{
        this.crearInstitucion();
      }
    } else {
      this.formInstitucion.markAllAsTouched();
    }
    
  }
  
  //Funciones para optener provincia a partir de departamento
  obtenerProvinciasDir() {
    const idDepartamento = this.formInstitucion.value['departamento'];
    (idDepartamento) && this.ubigeoService.findProvinciasByDepartments(idDepartamento).subscribe(data=> 
      this.provinciasDir = data
    );
  }

  //Funciones para optener provincia a partir de departamento
  obtenerDistritosDir() {
    const idDepartamento = this.formInstitucion.value['departamento'];
    const idProvincia = this.formInstitucion.value['provincia'];

    (idDepartamento) && (idProvincia) && this.ubigeoService.findAllDistritosByProvAndDept(idDepartamento, idProvincia)
      .subscribe(data => {
        this.distritosDir = data;
        console.log(data);
      });
  }

  buscarxDoc() {
    const numdocumento = this.formInstitucion.value['numdocumento'];
    const tipodocumento = this.formInstitucion.value['tipodocumento'];
    
    if (numdocumento && tipodocumento) {
      this.institucionService.findByRuc(tipodocumento, numdocumento).subscribe(
        (data) => {
          if (data && data.length > 0) {
            this.searchnumdocumento = data;
            this.formInstitucion.patchValue({
              razonSocial: this.searchnumdocumento[0].razonSocial,
              direccion: this.searchnumdocumento[0].direccion,
            });
          } else {
            this.rucService.consultarRUC(numdocumento).subscribe(
              (apiData) => {
                if (apiData) {
                  this.formInstitucion.patchValue({
                    razonSocial: apiData.razonSocial,
                    direccion: apiData.direccion,
                  });
                }
              },
              (error) => {
                console.error('Error al consultar API externa:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Error al buscar documento en personaService:', error);
        }
      );
    } else {
      console.warn('Debe ingresar número y tipo de documento.');
    }
  }
  private crearInstitucion(){
    const dataInstitucion:Institucion={
      numDocumento: String(this.formInstitucion.get('numdocumento')!.value),
      razonSocial: String(this.formInstitucion.get('razonsocial')!.value.trim()),
      nombreComercial:String(this.formInstitucion.get('nombrecomercial')!.value.toUpperCase().trim()),
      telefono: String(this.formInstitucion.get('telefono')?.value.trim()==""?null:this.formInstitucion.get('telefono')!.value.trim()),
      celular: String(this.formInstitucion.get('celular')!.value.trim()),
      correo: String(this.formInstitucion.get('correo')!.value.toUpperCase().trim()),
      igv: String(this.formInstitucion.get('igv')?.value.trim()==""?null:this.formInstitucion.get('igv')!.value.trim()),
      direccion: String(this.formInstitucion.get('direccion')!.value.trim()),
      urlLogo: this.selecionLogo(this.selectedLogo),
      usuarioSol: String(this.formInstitucion.get('usuariosol')!.value.trim()),
      claveSol: String(this.formInstitucion.get('clavesol')!.value.trim()),
      tipodocumento:{
        idTipoDocumento:Number(this.formInstitucion.get('tipodocumento')!.value)
      },
      ubigeo: {
        idUbigeo:Number(this.formInstitucion.get('distrito')!.value)
      }
    }
    console.log(dataInstitucion);
  }

  //Para Logo
  onImagelogo(event: any) {
    const file = event.target.files[0];
    console.log(event.target.files.item(0));
    console.log(file);
    if (file) {
      this.selectedLogo = URL.createObjectURL(file);
    }
  }
  removeImage() {
    this.selectedLogo ="";  
    const input = document.querySelector('.image-input') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
  private selecionLogo(select:string|null):string{
    if(select){
      
      return "hola";
    }else{
      return "else";
    }
  }
  validarNumeros(event:KeyboardEvent, type:ValidationType) {
    validarInput(event,type);
  }
}
