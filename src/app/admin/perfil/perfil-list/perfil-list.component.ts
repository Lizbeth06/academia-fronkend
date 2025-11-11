import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { Usuario } from '../../../model/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';
import { PerfilFormComponent } from '../perfil-form/perfil-form.component';
import { DialogFormService } from '../../../services/dialog-form.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-perfil-lista',
  imports:[MaterialModule,CommonModule],
  templateUrl: './perfil-list.component.html',
  styleUrls: ['./perfil-list.component.css']
})
export class PerfilListaComponent implements OnInit {
  passwordForm: FormGroup;
  usuario?: Usuario;
  isLoading = true;

  constructor(
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder, 
    private dialogFormService: DialogFormService,
    private usuarioService: UsuarioService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.passwordForm = this.fb.group({
      actual: ['', Validators.required],
      nueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    
    if (token) {
      this.isLoading = true;
      this.cdRef.detectChanges(); // Forzar detección de cambios inmediatamente
      
      const username = helper.decodeToken(token).sub;
      
      this.usuarioService.findByUsername(username).subscribe({
        next: (data: Usuario) => {
          // Asegurar estructura completa del objeto
          this.usuario = {
            ...data,
            trabajador: data.trabajador || {
              persona: {},
              cargo: { tipoCargo: {} },
              oficina: {}
            }
          };
          
          this.isLoading = false;
          this.cdRef.detectChanges(); // Forzar actualización de la vista
        },
        error: (err) => {
          console.error('Error:', err);
          this.isLoading = false;
          this.cdRef.detectChanges();
          this.snackBar.open('Error al cargar perfil', 'Cerrar', {duration: 3000});
        }
      });
    } else {
      this.isLoading = false;
      this.cdRef.detectChanges();
    }
  }

  get profileImage(): string {
    return this.usuario?.urlFoto || 'assets/default-profile.png';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.usuario) {
      // 1. Subir la imagen al backend
      this.usuarioService.saveFile(file).subscribe({
        next: (res) => {
          const fotoUrl = res.url;
          // 2. Actualizar el usuario con la URL que devolvió el backend
          this.usuarioService.actualizarFoto(this.usuario!.idUsuario!, fotoUrl).subscribe({
            next: () => {
              this.usuario!.urlFoto = fotoUrl;
              console.log('Foto actualizada con nueva URL');
            },
            error: err => console.error('Error al actualizar la foto con la URL', err)
          });
        },
        error: err => console.error('Error al subir archivo', err)
      });
    }
  }




  guardarCambios(): void {
    if (this.usuario) {
      console.log('Cambios guardados:', this.usuario);
      this.snackBar.open('Datos actualizados correctamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  }

  updatePassword() {
    if (this.passwordForm.valid && this.passwordForm.value.nueva === this.passwordForm.value.confirmar) {
      
      this.snackBar.open('Contraseña actualizada correctamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    } else {
      this.snackBar.open('Las contraseñas no coinciden o no son válidas', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  
  
  actualizarDatos(usuario?: Usuario): void {
        const dialogRef = this.dialog.open(PerfilFormComponent, {
          width: '650px',
          height: '80vh', 
          maxWidth: 'none', 
          data:usuario,
        });
        this.loadUserData();

        dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result === true) {
            // Solo recarga si se hicieron cambios
            this.loadUserData();
            this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
        });

    }



}