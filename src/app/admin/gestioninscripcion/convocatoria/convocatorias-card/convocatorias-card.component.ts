import { Component, inject, OnInit } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { ConvocatoriaAgrupada } from "../../../../model/convocatoriaagrupada.model";
import { Router } from "@angular/router";
import { Listahorario } from "../../../../model/listahorario";
import { ListahorarioService } from "../../../../services/listahorario.service";
import { CommonModule } from "@angular/common";
import { Horario } from "../../../../model/horario.model";

@Component({
  selector: "app-convocatorias-card",
  imports: [CommonModule, MaterialModule],
  templateUrl: "./convocatorias-card.component.html",
  styleUrl: "./convocatorias-card.component.css",
})
export class ConvocatoriasCardComponent implements OnInit {
  constructor(private router: Router) {}

  private listahorarioService = inject(ListahorarioService);
  busqueda: string = "";
  regionSeleccionada: string = "";
  sedeSeleccionada: string = "";
  deporteSeleccionado: string = "";
  tipoSeleccionado: string = "";
  cargando: boolean = false;
  mostrarFiltros: boolean = false;
  mostrarFormulario: boolean = false;

  regiones: string[] = [];
  sedes: string[] = [];
  deportes: string[] = [];
  tipos: string[] = [];

  listaconvocatoriaCard: Listahorario[] = [];
  tiposConvocatoria: any[] = [];
  listaCovocatoria: { data: any[] } = { data: [] };
  convocatoriasFiltradas: ConvocatoriaAgrupada[] = [];

  ngOnInit(): void {
    this.obteniendoCardConvocatoria();
  }
  obteniendoCardConvocatoria() {
    this.cargando = true;
    this.listahorarioService.findAll().subscribe({
      next: (data) => {
        this.cargando = false;
        this.listaconvocatoriaCard = data;
        console.log(data);
      },
    });
  }
  aplicarFiltros(): void {
    this.convocatoriasFiltradas = this.listaCovocatoria.data.filter((conv) => {
      const matchBusqueda =
        this.busqueda === "" ||
        conv.convocatoria.titulo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        conv.convocatoria.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        conv.convocatoria.subtitulo.toLowerCase().includes(this.busqueda.toLowerCase());

      // const matchRegion = this.regionSeleccionada === "" || conv.region === this.regionSeleccionada;
      // const matchSede = this.sedeSeleccionada === "" || conv.sede === this.sedeSeleccionada;
      // const matchDeporte = this.deporteSeleccionado === "" || conv.deporte === this.deporteSeleccionado;
      // const matchTipo = this.tipoSeleccionado === "" || conv.tipo === this.tipoSeleccionado;
      // return matchBusqueda && matchRegion && matchSede && matchDeporte && matchTipo;
    });
  }

  limpiarFiltros(): void {
    this.busqueda = "";
    this.regionSeleccionada = "";
    this.sedeSeleccionada = "";
    this.deporteSeleccionado = "";
    this.tipoSeleccionado = "";
    this.aplicarFiltros();
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  getPorcentajeCupos(horario: Horario): number {
    return Math.round((horario.numVacante - horario.contador) / horario.numVacante) * 100;
  }

  getTipoTexto(tipo: string): string {
    return tipo === "paradeporte" ? "Para Deporte" : "Deporte";
  }

  volverConvocatoria() {
    this.router.navigate(["/admin/inscripcion/convocatoria"]);
  }
}
