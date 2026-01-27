import { Routes } from "@angular/router";
import { ValidacioninscripcionListaComponent } from "./validacioninscripcion-lista/validacioninscripcion-lista.component";
import { ValidacionFormComponent } from "./validacion-form/validacion-form.component";

export const validacion_routes: Routes = [
  {
    path: "",
    component: ValidacioninscripcionListaComponent,
  },

  {
    path: "validando",
    component: ValidacionFormComponent,
  },
];
