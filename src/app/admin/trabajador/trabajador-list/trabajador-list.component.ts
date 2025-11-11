import { AfterViewInit, Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {TrabajadorFormComponent} from '../trabajador-form/trabajador-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '../../../material/material.module';
import { TrabajadorService } from '../../../services/trabajador.service';
import { Trabajador } from '../../../model/trabajador';
@Component({
  selector: 'app-trabajdor-list',
  imports: [MaterialModule],
  templateUrl: './trabajador-list.component.html',
  styleUrl: './trabajador-list.component.css'
})
export class TrabajadorListComponent implements OnInit{
  displayedColumns: string[] = ['id','accion','foto','codigo', 'documento', 'nombres', 'fingreso', 'oficina'];
  dataSource!: MatTableDataSource<Trabajador>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private trabajadorService: TrabajadorService
  ) {}

  ngOnInit(): void {
    this.trabajadorService.findAll().subscribe(data => {
      this.crearTabla(data);
    });
  }

  crearTabla(data:Trabajador[]){
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

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(TrabajadorFormComponent, {
      width: '70vw',
      height: '70vh', 
      maxWidth: 'none', 
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

}
