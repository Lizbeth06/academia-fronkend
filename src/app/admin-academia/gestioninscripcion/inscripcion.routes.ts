import { Routes } from "@angular/router";
import { PreinscripcionListaComponent } from "./preinscripcion/preinscripcion-lista/preinscripcion-lista.component";

export const inscripcionRoutes: Routes = [
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
    component: PreinscripcionListaComponent,
    title: "pre inscripción",
  },
];
