import { Component } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ayuda-lista',
  imports: [MaterialModule,CommonModule],
  templateUrl: './ayuda-lista.component.html',
  styleUrl: './ayuda-lista.component.css'
})
export class AyudaListaComponent {

  preguntasFrecuentes = [
    { pregunta: '¿Cómo puedo registrarme?', respuesta: 'Para registrarte, ve a la página de inicio y haz clic en "Registrarse".' },
    { pregunta: '¿Cómo cambio mi contraseña?', respuesta: 'Puedes cambiar tu contraseña en la sección de configuración de tu cuenta.' },
    { pregunta: '¿Dónde puedo contactar con soporte?', respuesta: 'Puedes contactar con soporte a través del formulario en la página de contacto.' }
  ];

  constructor() {}

}
