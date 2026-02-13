import { Routes } from "@angular/router";
import { ConvocatoriaFormComponent } from "./convocatoria-form/convocatoria-form.component";
import { ConvocatoriaComponent } from "./convocatoria_lista/convocatoria-lista.component";
import { ConvocatoriasCardComponent } from "./convocatorias-card/convocatorias-card.component";

export const convocatoriaRoutes: Routes = [
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
  {
    path: "cards",
    component: ConvocatoriasCardComponent,
  },
];
