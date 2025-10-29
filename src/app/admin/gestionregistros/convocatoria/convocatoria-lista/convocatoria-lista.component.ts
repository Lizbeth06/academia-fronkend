import { Component, inject, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConvocatoriaFormComponent } from '../convocatoria-form/convocatoria-form.component';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs';
import { MaterialModule } from '../../../../material/material.module';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-convocatoria-lista',
  imports: [MaterialModule, DatePipe],
  templateUrl: './convocatoria-lista.component.html',
  styleUrl: './convocatoria-lista.component.css'
})
export class ConvocatoriaListaComponent implements OnInit {
  /*convocatoria:Convocatoria[]=[];
  dataSource!:MatTableDataSource<Convocatoria>;*/
  displayedColumns: string[] = ['id','action', 'numconvocatoria', 'objetivo', 'fregistro', 'urlbase', 'urlresultadoinscripcion', 'urlresultadoconocimiento', 'urlresultadopsicologico', 'urlresultadocurricular', 'urlresultadoentrevista', 'urlresultadofinal', 'comunicados', 'tipo', 'ubigeo'];
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /*private convocatoriaService=inject(ConvocatoriaService);*/
  

  private matDialogRef!: MatDialogRef<any>; 

  constructor(
    public dialog: MatDialog,
    private _snackBar:MatSnackBar,
  ){}

  //para mostral el año actual
  anoactual?: number;
  ngOnInit(): void { 
   
  }

  /*createtable(data:Convocatoria[]){
    this.dataSource=new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialog(convocatoria?:Convocatoria): void {
      this.dialog.open(ConvocatoriaFormComponent, {
        width: '850px',
        maxWidth: 'none', 
        data:convocatoria,
      });
  }*/

  delete(idConvocatoria:number){
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

       /* this.convocatoriaService.delete(idConvocatoria)
        .pipe(switchMap(()=>this.convocatoriaService.findAll()))
        .subscribe(data=>{
          this.convocatoriaService.setConvocatoriaChange(data);
          this.convocatoriaService.setMessageChange('ELIMINADO!');
        })

        Swal.fire({
          title: "Eliminado!",
          text: "Su lista ha sido eliminado.",
          icon: "success",
          timer: 500,
        });*/


      }
    });
  }


  //inicio para el buscador de la tabla
  /*applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  } */
  //final de buscador de tabla

}