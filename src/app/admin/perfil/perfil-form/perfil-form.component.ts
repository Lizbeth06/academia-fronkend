import { Component, inject, Inject } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../../model/usuario';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuarioService } from '../../../services/usuario.service';
import { PersonaService } from '../../../services/persona.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-perfil-form',
  imports: [MaterialModule],
  templateUrl: './perfil-form.component.html',
  styleUrl: './perfil-form.component.css'
})
export class PerfilFormComponent {
  usuario: Usuario;
  perfilForm: FormGroup;
  profileImage: string | ArrayBuffer | null = 'assets/default-profile.png';
  titulo:string='';

  private usuarioService = inject(UsuarioService);
  private personaService = inject(PersonaService);

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Usuario,
    private dialogRef: MatDialogRef<PerfilFormComponent>,
    private fb:FormBuilder,
  ){

  }
  
  ngOnInit(): void{
  
      this.usuario={ ...this.data};
  
      this.titulo=this.usuario && this.usuario.idUsuario ? 'Perfil Usuario' : 'Registrar Perfil';
  
      this.initForm();
      
  
      if(this.usuario && this.usuario.idUsuario){
        this.perfilForm.patchValue({
          correo:this.usuario.trabajador.persona.correo,
          telefono:this.usuario.trabajador.persona.telefono,
        })
      }
      
    }
  
    initForm(){
      this.perfilForm=new FormGroup({
        correo:new FormControl('',[Validators.required]),
        telefono:new FormControl('',[Validators.required]),
      })
    }



  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  

  onSubmit(){
    if(this.perfilForm.valid){
          //4to metodo
          const correo=this.perfilForm.get('correo')?.value;
          const telefono=this.perfilForm.get('telefono')?.value;

          const idPersona = this.usuario.trabajador.persona.idPersona;
    
        
          if(this.usuario!=null && (this.usuario.idUsuario?? 0)>0){
            //actualizas
            this.personaService.updateByCorreoTelefonoByIdpersona(idPersona,correo, telefono)
            .subscribe({
              next: () => {
                this.dialogRef.close(true); // ✅ devuelve true al cerrar
              },
              error: err => {
                console.error('Error al actualizar persona', err);
              }
            });

          }
    
          this.close();
    
        }

  }

  close(){
    this.dialogRef.close();
  }
}
