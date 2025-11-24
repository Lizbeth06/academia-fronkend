import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';


export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
  },

  //gestion de usuario
  {
    path: 'usuario',
    loadChildren: () => import('./gestionusuario/usuario.routes').then((r) => r.usuarioRoutes),
  },

  //gestion de inscripcion
  {
    path: 'inscripcion',
    loadChildren: () => import('./gestioninscripcion/inscripcion.routes').then((r) => r.inscripcionRoutes),
  },

  //registro nacional de talentos deportivos
  {
    path: 'rntd',
    loadChildren: () => import('./rntd/rntd.routes').then((r) => r.rntdRoutes),
  },

 {
    path: '**',
    redirectTo: '',
  }
];