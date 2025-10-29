import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material.module';
import { UsuarioFormComponent } from '../usuario-form/usuario-form.component';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../model/usuario';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-usuario-list',
  imports: [MaterialModule,CommonModule],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.css'
})
export class UsuarioListComponet  implements OnInit{
  displayedColumns: string[] = ['id', 'accion', 'fechaRegistro', 'isActive','usernombres'];
  dataSource!: MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
      private usuarioService: UsuarioService
    ) {}

  ngOnInit(): void {
     this.usuarioService.findAll().subscribe(data => {
       this.crearTabla(data);
     });
   }
 
   crearTabla(data:Usuario[]){
     this.dataSource=new MatTableDataSource(data);
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
   }
 
 
 
   applyFilter(event: Event) {
     const filterValue = (event.target as HTMLInputElement).value;
     this.dataSource.filter = filterValue.trim().toLowerCase();
 
     if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage();
     }
     
   }
 
   readonly dialog = inject(MatDialog);
 
   openDialog(usuario?: Usuario): void {
     this.dialog.open(UsuarioFormComponent, {
       width: '70vw',
       height: '70vh', 
       maxWidth: 'none', 
       data: usuario,
     });
   }

   delete(idUsuario:number){
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.delete(idUsuario)
        .pipe(switchMap(()=>this.usuarioService.findAll()))
        .subscribe(data=>{
          this.usuarioService.setUsuarioChange(data);
          this.usuarioService.setMessageChange('ELIMINADO!');
        })

        Swal.fire({
          title: "Eliminado!",
          text: "Su lista ha sido eliminado.",
          icon: "success",
          timer: 500,
        });


      }
    });
  }
 
 }
 