import { AfterViewInit, ChangeDetectorRef, Component, inject, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2, signal, DOCUMENT } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { MenuOption } from './interfaces/menu-option';
import { LoginService } from '../../services/login.service';
import { isPlatformBrowser, NgClass, TitleCasePipe } from '@angular/common';
import { ItemMenuOptionComponent } from './components/item-menu-option/item-menu-option.component';
import { Usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { Menu } from '../../model/menu';
import { MenuAgrupado } from '../../model/MenuAgrupado';
import { Subscription } from 'rxjs';
import { MenuService } from '../../services/menu.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { InstitucionService } from '../../services/institucion.service';
import { Institucion } from '../../model/institucion';


declare var pcoded: any;
declare var feather: any;

@Component({
  selector: 'app-layout',
  imports: [
    RouterModule,
    MaterialModule,
    RouterOutlet,
    ItemMenuOptionComponent,
    MatIconModule,
    TitleCasePipe,
    NgClass
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  isLoading = true;
  nombreConRol: string = '';
  usuario?: Usuario;
  institucion?: Institucion;
  currentYear: number = new Date().getFullYear();

  menus: Menu[] = [];
  menuGrupos: MenuAgrupado[] = [];
  menusSinGrupo: Menu[] = [];
  menusDropdown: Menu[] = [];

  isCollapsed = true;
  isHovered = false;

  fotourl: string = 'https://res.cloudinary.com/devdt1imc/image/upload/v1756398827/userhombre_zsvdv5-removebg-preview_dreqwm.png';
  logourl: string = 'https://res.cloudinary.com/dpumt2sth/image/upload/v1760922675/logo_academia_1_flddol.png';
  nombreInstitucion: string = 'INSTITUTO PERUANO DEL DEPORTE';


  nombreTienda: any;

  private subscriptions: Subscription = new Subscription();
  private imageUpdateListener: any;

  private usuarioService = inject(UsuarioService);
  private institucionService = inject(InstitucionService);
  private loginService = inject(LoginService);
  private menusService = inject(MenuService);
  private cdRef = inject(ChangeDetectorRef);
  private renderer2 = inject(Renderer2);
  private _document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);



  readonly dialog = inject(MatDialog);



  ngOnInit(): void {
    this.loadScript('./assets/admin/js/feather.min.js', () => {
      feather.replace();
    });

    this.setupSidebarToggle();

    if (isPlatformBrowser(this.platformId)) {
      this.loadInitialData();
    }

    this.cargarLogoInstitucion();
  }

  private loadInitialData(): void {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);

    if (!token) {
      this.handleLoadError('No se encontró token');
      return;
    }

    let username: string;
    try {
      const decodedToken = helper.decodeToken(token);
      username = decodedToken.sub;
    } catch (e) {
      this.handleLoadError('Token inválido', e);
      return;
    }

    this.isLoading = true;

    this.usuarioService.findByUsername(username).subscribe({
      next: (usuario: Usuario) => {
        if (!usuario || !usuario.idUsuario) {
          this.handleLoadError('Usuario no encontrado');
          return;
        }

        this.usuario = usuario;

        const rol = usuario.roles?.[0];
        const nombres = usuario.trabajador?.persona?.nombres || '';
        const apellido = usuario.trabajador?.persona?.apaterno || '';
        this.nombreConRol = `${nombres} ${apellido} - (${rol?.descripcion || 'Sin Rol'})`;



        const idRol = rol?.idRol;

        if (typeof idRol === 'number') {
          this.cargarYProcesarMenu(idRol, usuario.idUsuario);
        } else {
          this.handleLoadError('Usuario no tiene un Rol válido');
        }

        this.cdRef.detectChanges();
      },
      error: (err) => {
        this.handleLoadError('Error al cargar el usuario (posible 401/403)', err);
      },
    });
  }

  fotopersona(): string {
    const fotoUsuario = this.usuario?.trabajador?.persona?.urlFoto;
    if (fotoUsuario && fotoUsuario.trim() !== '') {
      return fotoUsuario;
    }
    return this.fotourl; 
  }

  private cargarLogoInstitucion(): void {
    this.institucionService.findById(1).subscribe({
      next: (institucion: Institucion) => {
        if (institucion) {
          this.logourl = institucion.urlLogo?.trim()
            ? institucion.urlLogo
            : 'https://res.cloudinary.com/dpumt2sth/image/upload/v1760922675/logo_academia_1_flddol.png';

          // Si existe nombre comercial, úsalo; si no, deja el texto por defecto
          this.nombreInstitucion = institucion.nombreComercial?.trim()
            ? institucion.nombreComercial
            : 'ACADEMINIA IPD';

        }
      },
      error: (err) => {
        this.logourl = 'https://res.cloudinary.com/dpumt2sth/image/upload/v1760922675/logo_academia_1_flddol.png';
        this.nombreInstitucion = 'ACADEMINIA IPD';
      },
    });
  }

  logoinstitucion(): string {
    return this.logourl;
  }
  nombreinstitucion(): string {
    return this.nombreInstitucion;
  }


  private handleLoadError(message: string, error?: any): void {
    console.error(message, error || '');
    this.isLoading = false;
    this.cdRef.detectChanges();
    this.logout();
  }


  private cargarYProcesarMenu(idRol: number, idUsuario: number): void {
    this.menusService.getMenuByidRolUsuario(idRol, idUsuario).subscribe({
      next: (menuData: Menu[]) => {
        
        this.menus = menuData;
        this.procesarMenu(menuData);
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar los menús por rol:', err);
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      requestAnimationFrame(() => {
        try {
          if (feather && feather.replace) feather.replace();
        } catch (e) {
          console.error('Error feather.replace():', e);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (isPlatformBrowser(this.platformId) && this.imageUpdateListener) {
      window.removeEventListener('profileImageUpdated', this.imageUpdateListener);
    }
  }



  private loadScript(url: string, callback: () => void) {
    const script = this.renderer2.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.onload = callback;
    this.renderer2.appendChild(this._document.body, script);
  }

  private procesarMenu(menus: Menu[]): void {
    const gruposMap = new Map<number, MenuAgrupado>();
    this.menusSinGrupo = [];
    this.menusDropdown = [];

    menus.forEach((menu) => {
      if (menu.menugrupo && menu.menugrupo.lugarmenu === 2) {
        const idGrupo = menu.menugrupo.idMenugrupo;
        if (!gruposMap.has(idGrupo)) {
          gruposMap.set(idGrupo, { grupo: menu.menugrupo, items: [] });
        }
        gruposMap.get(idGrupo)!.items.push(menu);
      } else if (menu.menugrupo && menu.menugrupo.lugarmenu === 1) {
        this.menusDropdown.push(menu);
      } else {
        this.menusSinGrupo.push(menu);
      }
    });

    this.menuGrupos = Array.from(gruposMap.values()).sort(
      (a, b) => a.grupo.idMenugrupo - b.grupo.idMenugrupo
    );
  }

  private setupSidebarToggle(): void {
    const toggleButton = this._document.querySelector('.sidebar-toggle');
    const sidebar = this._document.querySelector('.adminx-sidebar');
    if (toggleButton && sidebar) {
      toggleButton.addEventListener('click', () => sidebar.classList.toggle('open'));
    }
  }

  onSidebarHover(value: boolean): void {
    this.isHovered = value;
  }

  confirmLogout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }

  logout() {
    this.loginService.logout();
  }
}