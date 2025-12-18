import { Routes } from "@angular/router";
import { ConvocatoriaFormComponent } from "./convocatoria-form/convocatoria-form.component";
import { ConvocatoriaComponent } from "./convocatoria_lista/convocatoria-lista.component";
import { HorariosFormComponent } from "./horarios-form/horarios-form.component";

export const convocatoria_routes: Routes = [
  {
    path: "",
    component: ConvocatoriaComponent,
  },
  {
    path: "agregar",
    component: ConvocatoriaFormComponent,
  },

  {
    path: "editar",
    component: ConvocatoriaFormComponent,
  },
];
