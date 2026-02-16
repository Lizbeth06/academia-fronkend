import { Routes } from "@angular/router";
import { CategoriaListaComponent } from "./categoria/categoria-lista/categoria-lista.component";
import { TurnosListaComponent } from "./turnos/turnos-lista/turnos-lista.component";
import { SedesListaComponent } from "./sedes/sedes-lista/sedes-lista.component";
import { DisciplinasListaComponent } from "./disciplinas/disciplinas-lista/disciplinas-lista.component";
import { TemporadaListaComponent } from "./temporada/temporada-lista/temporada-lista.component";

export const gestionconvocatoriaRoutes: Routes = [
  {
    path: "convocatoria",
    title: "convocatorias",
    children: [
      {
        path: "",
        loadChildren: () => import("./convocatoria/convocatoria.routes").then((m) => m.convocatoriaRoutes),
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
