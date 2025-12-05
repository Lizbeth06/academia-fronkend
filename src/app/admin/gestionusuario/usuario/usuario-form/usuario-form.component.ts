import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../material/material.module';
import { Persona } from '../../../../model/persona';
import { TipodocumentoService } from '../../../../services/tipodocumento.service';
import { TrabajadorService } from '../../../../services/trabajador.service';
import { PersonaService } from '../../../../services/persona.service';
import { Trabajador } from '../../../../model/trabajador';
import { Usuario } from '../../../../model/usuario';

@Component({
  selector: 'app-usuario-form',
  imports: [MaterialModule, MatPseudoCheckboxModule, FormsModule, MatRadioModule],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent {
  
  labelPosition: 'before' | 'after' = 'after';
  form!: FormGroup;
  searchnumdocumento!:Persona[];
  persona!:Persona[];
  trabajador!: Trabajador[];
  usuario!: Usuario;
  titulo!: string;

 

  private tipodocumentoService=inject(TipodocumentoService);
  private trabajadorService=inject(TrabajadorService);
  private personaService=inject(PersonaService);

  constructor( 
    @Inject(MAT_DIALOG_DATA) private data:Usuario,
    private _dialogRef: MatDialogRef<UsuarioFormComponent>,
    private fb: FormBuilder
    ) {}

  ngOnInit(): void {

    this.usuario={ ...this.data }
    this.initForm();

    this.trabajadorService.findAll().subscribe(data => {
      this.trabajador = data;
    })

    this.titulo=this.usuario && this.usuario.idUsuario? 'Actualizar usuario' : 'Nuevo usuario';


  //mostrar en el formulario los datos de la usuario cuando editamos
    if(this.usuario && this.usuario.idUsuario){
      this.form.patchValue({
        trabajador: this.usuario.trabajador?.idTrabajador,
        numDocumento: this.usuario.trabajador?.persona?.numDocumento,
        nombres: this.usuario.trabajador?.persona?.nombres,
        apaterno: this.usuario.trabajador?.persona?.apaterno,
        amaterno:this.usuario.trabajador?.persona?.amaterno,
        genero:this.usuario.trabajador?.persona?.genero,
        isActive:this.usuario.isActive,
        username:this.usuario.username,
        password:this.usuario.password,
        urlFoto:this.usuario.trabajador?.persona?.urlFoto,
        termino1:this.usuario.termino1,
        termino2:this.usuario.termino2
    });

    } 
  }

  initForm() {
  this.form = new FormGroup({
    tipodocumento: new FormControl('', Validators.required),
    numDocumento: new FormControl('', Validators.required),
    nombres: new FormControl('', Validators.required),
    apaterno: new FormControl('', Validators.required),
    amaterno: new FormControl('', Validators.required),
    genero: new FormControl('', Validators.required),
    fRegistro: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    isActive: new FormControl('', Validators.required),
    urlFoto: new FormControl(''),
    termino1: new FormControl('', Validators.required),
    termino2: new FormControl('', Validators.required),
    trabajador: new FormControl('', Validators.required),
  });
}



operate() {

}

buscarxDoc() {
  
  const numdocumento = this.form.value['numDocumento'];
  const tipodocumento = this.form.value['tipodocumento'];
  (numdocumento) && (tipodocumento) && this.personaService.findTipodocByNumdoc(tipodocumento,numdocumento).subscribe(
  

    (data) => {
      if (data && data.length > 0) {
        this.searchnumdocumento = data; 
        this.form.patchValue({
          nombres: this.searchnumdocumento[0].nombres,
          apaterno: this.searchnumdocumento[0].apaterno,
          amaterno: this.searchnumdocumento[0].amaterno
        });
      }
    },
    (error) => {
      console.error('Error al buscar documento:', error);
    }

   );
  }
  
}
