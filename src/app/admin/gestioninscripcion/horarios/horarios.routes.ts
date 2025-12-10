import { Routes } from "@angular/router";
import { HorariosFormComponent } from "./horarios-form/horarios-form.component";
import { HorariosListaComponent } from "./horarios-lista/horarios-lista.component";

export const horarios_routes: Routes = [
  {
    path: "",
    component: HorariosListaComponent,
  },
  {
    path: "agregar",
    component: HorariosFormComponent,
  },

  {
    path: "editar",
    component: HorariosFormComponent,
  },
];
