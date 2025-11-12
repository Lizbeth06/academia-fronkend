import { Routes } from '@angular/router';
import { PerfilListaComponent } from './perfil/perfil-list/perfil-list.component';
import { TrabajadorListComponent } from './trabajador/trabajador-list/trabajador-list.component';
import { UsuarioListComponet } from './usuario/usuario-list/usuario-list.component';
import { InstitucionListComponent } from './institucion/institucion-list/institucion-list.component';
import { AyudaListaComponent } from './ayuda/ayuda-lista/ayuda-lista.component';

export const usuarioRoutes: Routes = [

        {
            path: 'perfil',
            component: PerfilListaComponent,
            title: 'perfil'
        },
        {
            path: 'trabajador',
            component: TrabajadorListComponent,
            title: 'trabajador'
        },
        {
            path: 'usuario',
            component: UsuarioListComponet,
            title: 'usuarios'
        },
        {
            path: 'institucion',
            component: InstitucionListComponent,
            title: 'institucion'
        },
        {
            path: 'ayuda',
            component: AyudaListaComponent,
            title: 'ayuda'
        },

    ]