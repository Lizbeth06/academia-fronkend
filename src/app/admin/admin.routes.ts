import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InstitucionListComponent } from './institucion/institucion-list/institucion-list.component';

import { AyudaListaComponent } from './ayuda/ayuda-lista/ayuda-lista.component';
import { PerfilListaComponent } from './perfil/perfil-list/perfil-list.component';
import { UsuarioListComponet } from './usuario/usuario-list/usuario-list.component';
import { TrabajadorListComponent } from './trabajador/trabajador-list/trabajador-list.component';
import { ConvocatoriaListaComponent } from './gestionregistros/convocatoria/convocatoria-lista/convocatoria-lista.component';


export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
  },

  //  Rutas de Gestión de Perfiles
  {
    path: 'perfil',
    component: PerfilListaComponent,
  },
  {
    path: 'trabajador',
    component: TrabajadorListComponent,
  },
  {
    path: 'usuario',
    component: UsuarioListComponet,
  },
  {
    path: 'institucion',
    component: InstitucionListComponent,
  },
  {
    path: 'ayuda',
    component: AyudaListaComponent,
  },


 
  
 

  
  {
    path: 'convocatoria',
    component: ConvocatoriaListaComponent, 
  },
  // Redirección por defecto si la ruta no existe
  {
    path: '**',
    redirectTo: '',
  }
];