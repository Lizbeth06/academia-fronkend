import { Routes } from "@angular/router";
import { DetecciontalentosListaComponent } from "./detecciontalentos/detecciontalentos-lista/detecciontalentos-lista.component";
import { EvarendimientodeportivoListaComponent } from "./evarendimientodeportivo/evarendimientodeportivo-lista/evarendimientodeportivo-lista.component";
import { ListadodetalentosListaComponent } from "./listadodetalentos/listadodetalentos-lista/listadodetalentos-lista.component";

export const rntdRoutes: Routes = [


    // 👇 NUEVAS RUTAS DE REGISTRO NACIONAL DE TALENTOS DEPORTIVOS
    {
        path: 'detecciontalentos',
        component: DetecciontalentosListaComponent,
        title: 'Deteccion de Talentos'
    },

    {
        path: 'evarendimientodeportivo',
        component: EvarendimientodeportivoListaComponent,
        title: 'Evaluacion de Rendimiento Deportivo'
    },

    {
        path: 'listadodetalentos',
        component: ListadodetalentosListaComponent,
        title: 'Listado de Talentos'
    },

    

 ]