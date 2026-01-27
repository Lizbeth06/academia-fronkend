import { Routes } from "@angular/router";
import { DisciplinasListaComponent } from "./disciplinas/disciplinas-lista/disciplinas-lista.component";
import { SedesListaComponent } from "./sedes/sedes-lista/sedes-lista.component";
import { ValidacioninscripcionListaComponent } from "./validacioninscripcion/validacioninscripcion-lista/validacioninscripcion-lista.component";
import { TurnosListaComponent } from "./turnos/turnos-lista/turnos-lista.component";
import { TemporadaListaComponent } from "./temporada/temporada-lista/temporada-lista.component";
import { PreInscripcionComponent } from "./preinscripcion/preinscripcion-lista/preinscripcion-lista.component";
import { CategoriaListaComponent } from "./categoria/categoria-lista/categoria-lista.component";

export const inscripcionRoutes: Routes = [
  // 👇 NUEVAS RUTAS DE PRE-INSCRIPCIÓN y CONVOCATORIA
  {
    path: "validacioninscripcion",
    title: "Validacion inscripcion",
    children: [
      {
        path: "",
        loadChildren: () => import("./validacioninscripcion/validacion.routes").then((m) => m.validacion_routes),
      },
    ],
  },

  {
    path: "pre-inscripcion",
    component: PreInscripcionComponent,
    title: "pre inscripción",
  },

  {
    path: "convocatoria",
    title: "convocatorias",
    children: [
      {
        path: "",
        loadChildren: () => import("./convocatoria/convocatoria.routes").then((m) => m.convocatoria_routes),
      },
    ],
  },
  {
    path: "categoria",
    component: CategoriaListaComponent,
    title: "categoria",
  },
  {
    path: "turnos",
    component: TurnosListaComponent,
    title: "turnos",
  },

  {
    path: "sedes",
    component: SedesListaComponent,
    title: "sedes",
  },

  {
    path: "disciplina",
    component: DisciplinasListaComponent,
    title: "disciplina",
  },

  {
    path: "temporada",
    component: TemporadaListaComponent,
    title: "temporada",
  },
];
