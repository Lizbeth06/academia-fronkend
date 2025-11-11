import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { isPlatformBrowser } from '@angular/common';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  private intervalId: any;
  private currentIndex = 0;
  username='';
  password ='';

  // Array de imágenes que se van a mostrar como fondo
  private images = [
    'https://res.cloudinary.com/dpumt2sth/image/upload/v1760923740/FB_IMG_1760923290035_zhpsdf.jpg',
    'https://res.cloudinary.com/dpumt2sth/image/upload/v1760925914/001141011W_ifexwv.jpg',

  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private loginService:LoginService,
    private router: Router,
    private tokenService: TokenService
  ){}

  login(){
    this.loginService.login(this.username,this.password).subscribe(data=>{
      // console.log(data)
      //localStorage
      this.tokenService.saveToken(data.access_token);
      sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
      this.router.navigate(['/admin']);
    });
  }

  //Evento del input password
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  // para cambiar de imagen de logo
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Solo ejecutamos esta función en el navegador
      this.changeBackgroundImage(); // Llamamos la función inmediatamente al iniciar
      this.intervalId = setInterval(() => this.changeBackgroundImage(), 9000); // Cambia la imagen cada 9 segundos
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Limpiamos el intervalo cuando el componente se destruye
    }
  }

  // Función para cambiar la imagen de fondo
  private changeBackgroundImage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const authFluidRight = document.querySelector('.auth-fluid-right') as HTMLElement;
      if (authFluidRight) {
        authFluidRight.style.backgroundImage = `url('${this.images[this.currentIndex]}')`; // Asigna la nueva imagen
        this.currentIndex = (this.currentIndex + 1) % this.images.length; // Incrementa el índice y reinicia al llegar al final
      }
    }
  }

}
