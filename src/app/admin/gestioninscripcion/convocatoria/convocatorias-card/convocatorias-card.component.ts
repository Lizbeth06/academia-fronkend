import { Component, inject, OnInit } from "@angular/core";
import { MaterialModule } from "../../../../material/material.module";
import { ConvocatoriaAgrupada } from "../../../../model/convocatoriaagrupada.model";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ConvocatoriaService } from "../../../../services/convocatoria.service";
import { DisciplinaSede, Horario } from "../../../../model/disciplinasede.model";
import { UbigeoService } from "../../../../services/ubigeo.service";
import { Ubigeo } from "../../../../model/ubigeo.model";
import { Modalidad } from "../../../../model/horario.model";
import { ModalidadService } from "../../../../services/modalidad.service";
import { Disciplina } from "../../../../model/disciplina.model";
import { DisciplinaService } from "../../../../services/disciplina.service";
import { SedeService } from "../../../../services/sede.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Sede } from "../../../../model/sede.model";

@Component({
  selector: "app-convocatorias-card",
  imports: [CommonModule, MaterialModule],
  templateUrl: "./convocatorias-card.component.html",
  styleUrl: "./convocatorias-card.component.css",
})
export class ConvocatoriasCardComponent implements OnInit {
  constructor(private router: Router, private formBuild: FormBuilder) {
    this.buildForm();
  }

  private convocatoriaService = inject(ConvocatoriaService);
  private ubigeoService = inject(UbigeoService);
  private modalidadService = inject(ModalidadService);
  private disciplinaService = inject(DisciplinaService);
  private sedeService = inject(SedeService);
  busqueda: string = "";
  regionSeleccionada: string = "";
  sedeSeleccionada: string = "";
  deporteSeleccionado: string = "";
  tipoSeleccionado: string = "";
  cargando: boolean = false;
  mostrarFiltros: boolean = false;
  mostrarFormulario: boolean = false;

  regiones: Ubigeo[] = [];
  sedes: Sede[] = [];
  deportes: Disciplina[] = [];
  tipos: string[] = [];

  listaconvocatoriaCard: DisciplinaSede[] = [];
  tiposConvocatoria: Modalidad[] = [];
  listaconvocatoriaFiltro: DisciplinaSede[] = [];

  filtrosForm: FormGroup;

  buildForm() {
    this.filtrosForm = this.formBuild.group({
      region: [""],
      sede: [""],
      deporte: [""],
      tipo: [""],
    });
  }

  ngOnInit(): void {
    this.obteniendoCardConvocatoria();
    this.ubigeoService.getAllDepartments().subscribe((data) => {
      this.regiones = data;
    });
    this.modalidadService.findAll().subscribe((data) => {
      this.tiposConvocatoria = data;
    });
    this.disciplinaService.findAll().subscribe((data) => {
      this.deportes = data;
    });
  }
  obteniendoCardConvocatoria() {
    this.cargando = true;
    this.convocatoriaService.getConvocatoriapordisciplina().subscribe({
      next: (data) => {
        console.log(data);
        this.cargando = false;
        this.listaconvocatoriaCard = data;
        this.listaconvocatoriaFiltro = data;
      },
    });
  }
  onDepartamentoChange(): void {
    const nomdep = this.filtrosForm.get("region")?.value.ubiNombre;
    this.filtrosForm.patchValue({ sede: "" });
    this.sedes = [];
    this.sedeService.getSedexubicacion(`${nomdep}`).subscribe((data) => {
      this.sedes = data;
    });
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    console.log("entro");
    const filtros = this.filtrosForm ? this.filtrosForm.value : {};

    const region = filtros.region || "";
    const sede = filtros.sede || "";
    const deporte = filtros.deporte || null;
    const tipo = filtros.tipo || "";

    this.listaconvocatoriaFiltro = this.listaconvocatoriaCard.filter((conv) => {
      const matchBusqueda =
        !this.busqueda ||
        conv.convocatoria.titulo?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        conv.convocatoria.descripcion?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        conv.convocatoria.subtitulo?.toLowerCase().includes(this.busqueda.toLowerCase());

      const matchRegion =
        !region ||
        conv.convocatoria.titulo.includes(region.ubiNombre) ||
        conv.convocatoria.descripcion.includes(region.ubiNombre) ||
        conv.convocatoria.subtitulo.includes(region.ubiNombre);

      const matchSede = !sede || conv.sede?.nombre === sede?.nombre;

      const matchDeporte = !deporte || conv.disciplina?.descripcion === deporte?.descripcion;

      const matchTipo = !tipo || conv.horario[0].modalidad?.descripcion === tipo.descripcion;

      return matchBusqueda && matchSede && matchDeporte && matchRegion && matchTipo;
    });
  }

  limpiarFiltros(): void {
    this.busqueda = "";
    this.regionSeleccionada = "";
    this.sedeSeleccionada = "";
    this.deporteSeleccionado = "";
    this.tipoSeleccionado = "";
    this.filtrosForm.reset();
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
  obtenerDiasHora(data: Horario): string {
    const dias = data.turno.listadia?.map((l) => l.dias?.codigo).join(", ");
    const hora = `${data.turno.horainicio!.substring(0, 5)} - ${data.turno.horafin!.substring(0, 5)} `;
    const tipohorario = data.turno.tipoturno!.abreviatura === "M" ? "AM" : "PM";
    return `${dias} : ${hora}  ${tipohorario}`;
  }

  volverConvocatoria() {
    this.router.navigate(["/admin/inscripcion/convocatoria"]);
  }
}
