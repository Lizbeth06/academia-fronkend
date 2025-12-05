import { AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InstitucionFormComponent } from '../institucion-form/institucion-form.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../../../material/material.module';
import { PaginatorService } from '../../../../services/security/paginator.service';
import { InstitucionService } from '../../../../services/institucion.service';
import { DialogService } from '../../../../services/dialog/dialog.service';
import { Institucion } from '../../../../model/institucion';
import { DialogcustomComponent } from '../../../dialogcustom/dialogcustom.component';


@Component({
  selector: 'app-institucion-list',
  imports: [MaterialModule],
  templateUrl: './institucion-list.component.html',
  styleUrl: './institucion-list.component.css',
  providers:[{ provide: MatPaginatorIntl, useClass: PaginatorService}]
})
export class InstitucionListComponent implements OnInit {
  constructor(
    private institucionService: InstitucionService,
    private dialogService: DialogService,
    private toastrService: ToastrService
  ) {}
  displayedColumns: string[] = ['id', 'RazonSocial', 'numDocumento', 'igv','accion'];
  dataSource!: MatTableDataSource<Institucion>;
  private matDialogRef!: MatDialogRef<DialogcustomComponent>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  idInstitucion=0;
  
  ngOnInit(): void {
    this.getAllInstitucion();
  }
  getAllInstitucion(){
    this.institucionService.findAll().subscribe(data=>{
      this.crearTabla(data)});
  }  
  crearTabla(data:Institucion[]){
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

  openDialog(institucion?: Institucion): void {
    this.dialog.open(InstitucionFormComponent, {
      width: '70vw',
      height: '70vh', 
      maxWidth: 'none', 
      data:institucion,
    });
  }
  deleteInstitucion(){
    this.institucionService.delete(this.idInstitucion).subscribe({
      next: () => {
        this.getAllInstitucion();
        this.matDialogRef.close();
        this.toastrService.success("Se anuló correctamente la institución.", 'Eliminado correctamente', { timeOut: 3200 });
      }, error: (error) => {
        this.matDialogRef.close();
        this.toastrService.error(error.error.value[0].message, 'Error', { timeOut: 3200 });
      }
    });
  }
  //Modales
  openDeleteInstitucion(template: TemplateRef<any>,idInstitucion:number) {
    this.idInstitucion=idInstitucion;
    this.matDialogRef = this.dialogService.openDialogCustom({
      template
    })
  } 
  
}
  



