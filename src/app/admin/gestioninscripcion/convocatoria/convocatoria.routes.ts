import { Routes } from "@angular/router";
import { ConvocatoriaListaComponent } from "./convocatoria_lista/convocatoria-lista.component";
import { ConvocatoriaFormComponent } from "./convocatoria-form/convocatoria-form.component";

export const convocatoria_routes: Routes = [
  {
    path: "",
    component: ConvocatoriaListaComponent,
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
