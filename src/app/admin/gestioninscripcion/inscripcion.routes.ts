import { Routes } from '@angular/router';
import { ConvocatoriaComponent } from './convocatoria/convocatoria_lista/convocatoria.component';
import { DisciplinasListaComponent } from './disciplinas/disciplinas-lista/disciplinas-lista.component';
import { HorariosListaComponent } from './horarios/horarios-lista/horarios-lista.component';
import { SedesListaComponent } from './sedes/sedes-lista/sedes-lista.component';
import { ValidacioninscripcionListaComponent } from './validacioninscripcion/validacioninscripcion-lista/validacioninscripcion-lista.component';
import { TurnosListaComponent } from './turnos/turnos-lista/turnos-lista.component';
import { TemporadaListaComponent } from './temporada/temporada-lista/temporada-lista.component';
import { PreInscripcionComponent } from './preinscripcion/preinscripcion-lista/preinscripcion-lista.component';

export const inscripcionRoutes: Routes = [


    // 👇 NUEVAS RUTAS DE PRE-INSCRIPCIÓN y CONVOCATORIA
    {
        path: 'validacioninscripcion',
        component: ValidacioninscripcionListaComponent,
        title: 'Validacion inscripcion'
    },

    {
        path: 'pre-inscripcion',
        component: PreInscripcionComponent,
        title: 'pre inscripción'
    },
    

    {
        path: 'convocatoria',
        component: ConvocatoriaComponent, 
        title: 'convocatorias'
    },


    {
        path: 'horarios',
        component: HorariosListaComponent, 
        title: 'horarios'
    },

    {
        path: 'turnos',
        component: TurnosListaComponent, 
        title: 'turnos'
    },

    {
        path: 'sedes',
        component: SedesListaComponent,
        title: 'sedes'
    },

    {
        path: 'disciplina',
        component: DisciplinasListaComponent, 
        title: 'disciplina'
    },

    
    {
        path: 'temporada',
        component: TemporadaListaComponent, 
        title: 'temporada'
    },
  

 ]