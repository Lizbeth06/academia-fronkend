import { Component } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { ConvocatoriaAgrupada } from "../../../../model/convocatoriaagrupada.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-convocatorias-card",
  imports: [MaterialModule],
  templateUrl: "./convocatorias-card.component.html",
  styleUrl: "./convocatorias-card.component.css",
})
export class ConvocatoriasCardComponent {
  constructor(private router: Router) {}
  busqueda: string = "";
  regionSeleccionada: string = "";
  sedeSeleccionada: string = "";
  deporteSeleccionado: string = "";
  tipoSeleccionado: string = "";
  cargando: boolean = true;
  mostrarFiltros: boolean = false;
  mostrarFormulario: boolean = false;

  regiones: string[] = [];
  sedes: string[] = [];
  deportes: string[] = [];
  tipos: string[] = [];

  listaconvocatoriaCard: any[] = [];
  tiposConvocatoria: any[] = [];
  listaCovocatoria: { data: any[] } = { data: [] };
  convocatoriasFiltradas: ConvocatoriaAgrupada[] = [];

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
  volverConvocatoria() {
    this.router.navigate(["/admin/inscripcion/convocatoria"]);
  }
}
