import { ChangeDetectorRef, Component, inject, Inject, OnInit, Renderer2, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { MenuOption } from './interfaces/menu-option';
import { LoginService } from '../../services/login.service';
import { DOCUMENT } from '@angular/common';
import { ItemMenuOptionComponent } from './components/item-menu-option/item-menu-option.component';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';


declare var pcoded: any;
declare var feather: any;

@Component({
  selector: 'app-layout',
  imports: [
    RouterModule,
    MaterialModule,
    RouterOutlet,
    ItemMenuOptionComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  isLoading = true;
  usuario?: Usuario;
  isAdmin: boolean = false;
  nombreConRol: string = '';
  totalProductos=signal(0);
  headerProfileImage: string = 'https://res.cloudinary.com/devdt1imc/image/upload/v1756398827/userhombre_zsvdv5-removebg-preview_dreqwm.png';

  
  gestionInscripcionOptions: MenuOption[] = [
    {
      href: "/admin/operacion/inscripcion",
      icono: "VI",
      name: "Validación de inscripción",
    },
    {
      href: "/admin/pre-inscripcion/",
      icono: "ID",
      name: "Inscripcion directa",
    },
    {
      href: "/admin/convocatoria/",
      icono: "Co",
      name: "Convocatorias",
    },
    {
      href: "/admin/operacion/reserva",
      icono: "Hr",
      name: "Horarios",
    },
    {
      href: "/admin/operacion/reserva",
      icono: "Tu",
      name: "Turnos",
    },
    {
      href: "/admin/operacion/reserva",
      icono: "Se",
      name: "Sedes",
    },
    {
      href: "/admin/operacion/reserva",
      icono: "Di",
      name: "Disciplinas",
    },
    {
      href: "/admin/operacion/reserva",
      icono: "Te",
      name: "Temporada",
    },
  ];

   rntdOptions: MenuOption[] = [
    {
      href: "/admin/estudiante",
      icono: "DT",
      name: "Detección de talentos",
    },
    {
      href: "/admin/estudiante",
      icono: "LT",
      name: "Listado de talentos",
    },
    {
      href: "/admin/estudiante",
      icono: "ER",
      name: "Evaluación del rendimiento deportivo",
    },
  ];

  ReportesOptions: MenuOption[] = [
    {
      href: "/admin/pago",
      icono: "Be",
      name: "Beneficiarios",
    },
    {
      href: "/admin/pago",
      icono: "In",
      name: "Informes",
    },
    {
      href: "/admin/descuento",
      icono: "IH",
      name: "Inscritos por horario",
    },
  ];


  private usuarioService = inject(UsuarioService);


  constructor(
    private renderer2: Renderer2,
    private cdRef: ChangeDetectorRef,
    private loginService: LoginService,
    @Inject(DOCUMENT) private _document: Document
  ) {}

  ngOnInit(): void {
    const helper = new JwtHelperService();
        const token = sessionStorage.getItem(environment.TOKEN_NAME);
        if (token) {
          this.isLoading = true;
          this.cdRef.detectChanges(); // Forzar detección de cambios inmediatamente
          
          const username = helper.decodeToken(token).sub;
          //console.log(username);
          this.usuarioService.findByUsername(username).subscribe({
            next: (data: Usuario) => {
              this.usuario = data;
              
              this.isLoading = false;
    
              // Verifica si el usuario tiene el rol de administrador
              this.isAdmin = this.usuario?.roles?.some(role => role.idRol === 1) ?? false;
              const rolDescripcion = this.usuario.roles.length > 0 ? this.usuario.roles[0].descripcion : 'Sin Rol';
              this.nombreConRol = `${this.usuario.usernombres} (${rolDescripcion})`;
              this.cdRef.detectChanges(); // Forzar actualización de la vista
              this.headerProfileImage = data.urlFoto || 'https://res.cloudinary.com/devdt1imc/image/upload/v1756398827/userhombre_zsvdv5-removebg-preview_dreqwm.png';

            },
            
          });
        } else {
          this.isLoading = false;
          this.cdRef.detectChanges();
        }

    this.loadScript('./assets/admin/js/feather.min.js', () => {
      feather.replace();  // Inicializar Feather Icons después de cargar el script
    });

    this.setupSidebarToggle();


  }

  private loadScript(url: string, callback: () => void) {
    const script = this.renderer2.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.onload = callback;
    this.renderer2.appendChild(this._document.body, script);
  }

  private setupSidebarToggle() {
    const toggleButton = this._document.querySelector('.sidebar-toggle');
    const sidebar = this._document.querySelector('.adminx-sidebar');

    if (toggleButton && sidebar) {
      toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  }

  logout() {
    this.loginService.logout();
  }
}
