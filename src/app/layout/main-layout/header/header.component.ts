import { ChangeDetectorRef, Component, DOCUMENT, inject, OnInit, PLATFORM_ID, Renderer2 } from "@angular/core";
import { MaterialModule } from "../../../shared/components/material/material.module";
import { isPlatformBrowser, TitleCasePipe } from "@angular/common";
import Swal from "sweetalert2";
import { Usuario } from "../../../core/model/usuario";
import { Menu, MenuSubmenu } from "../../../core/model/menu";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../../../environments/environment";
import { UsuarioService } from "../../../core/services/usuario.service";
import { LoginService } from "../../../core/services/login.service";
import { MenuService } from "../../../core/services/menu.service";
import { InstitucionService } from "../../../core/services/institucion.service";
import { Institucion } from "../../../core/model/institucion";
import { MenuTreeService } from "../../../core/util/menutree.util";
import { RouterLink } from "@angular/router";
import { DataService } from "../../../core/services/data.service";

declare var feather: any;

@Component({
  selector: "app-header",
  imports: [MaterialModule, RouterLink, TitleCasePipe],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent implements OnInit {
  constructor(
    private menuTreeService: MenuTreeService,
    private dataService: DataService,
  ) {}
  isLoading = true;
  nombreConRol: string = "";
  usuario?: Usuario;

  menusDropdown: Menu[] = [];
  menu: MenuSubmenu[] = [];

  private platformId = inject(PLATFORM_ID);
  private usuarioService = inject(UsuarioService);
  private institucionService = inject(InstitucionService);
  private loginService = inject(LoginService);
  private menuService = inject(MenuService);
  private cdRef = inject(ChangeDetectorRef);
  private renderer2 = inject(Renderer2);
  private _document = inject(DOCUMENT);

  fotourl: string = "https://res.cloudinary.com/devdt1imc/image/upload/v1756398827/userhombre_zsvdv5-removebg-preview_dreqwm.png";
  logourl: string = "https://res.cloudinary.com/dpumt2sth/image/upload/v1760922675/logo_academia_1_flddol.png";
  nombreInstitucion: string = "INSTITUTO PERUANO DEL DEPORTE";

  ngOnInit(): void {
    this.loadScript("./assets/admin/js/feather.min.js", () => {
      try {
        feather.replace();
      } catch (e) {
        console.error("Error al reemplazar Feather Icons:", e);
      }
    });
    if (isPlatformBrowser(this.platformId)) {
      this.loadInitialData();
    }
    this.setupSidebarToggle();
    this.cargarLogoInstitucion();
  }
  private setupSidebarToggle(): void {
    const toggleButton = this._document.querySelector(".sidebar-toggle");
    const sidebar = this._document.querySelector(".adminx-sidebar");
    if (toggleButton && sidebar) {
      toggleButton.addEventListener("click", () => sidebar.classList.toggle("open"));
    }
  }
  private loadInitialData(): void {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);

    if (!token) {
      this.handleLoadError("No se encontró token");
      return;
    }

    let username: string;
    try {
      const decodedToken = helper.decodeToken(token);
      username = decodedToken.sub;
    } catch (e) {
      this.handleLoadError("Token inválido", e);
      return;
    }

    this.isLoading = true;

    this.usuarioService.findByUsername(username).subscribe({
      next: (usuario: Usuario) => {
        if (!usuario || !usuario.idUsuario) {
          this.handleLoadError("Usuario no encontrado");
          return;
        }

        this.usuario = usuario;
        const rol = usuario.usuariorol[0].rol;
        const nombres = usuario.persona.nombres || "";
        const apellido = usuario.persona.apaterno || "";
        this.nombreConRol = `${nombres} ${apellido} - (${rol.nombre})`;
        this.cargarYProcesarMenu(usuario.idUsuario);
        this.cdRef.detectChanges();
      },
      error: (err) => {
        this.handleLoadError("Error al cargar el usuario (posible 401/403)", err);
      },
    });
  }

  private handleLoadError(message: string, error?: any): void {
    console.error(message, error || "");
    this.isLoading = false;
    this.cdRef.detectChanges();
    this.logout();
  }

  private cargarYProcesarMenu(idUsuario: number): void {
    this.menuService.getMenuByidRolUsuario(idUsuario).subscribe({
      next: (data: Menu[]) => {
        this.dataService.sendData(this.menuTreeService.buildMenuTree(data));
        const foundMenu = this.menuTreeService.buildMenuTree(data).find((m) => m.idMenu === 1);
        this.menu = foundMenu ? [foundMenu] : [];
        this.procesarMenu(this.menu[0].children!);
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error("Error al cargar los menús por rol:", err);
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  fotopersona(): string {
    const fotoUsuario = this.usuario?.persona?.urlFoto;
    if (fotoUsuario && fotoUsuario.trim() !== "") {
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
            : "https://res.cloudinary.com/dpumt2sth/image/upload/v1760922675/logo_academia_1_flddol.png";

          // Si existe nombre comercial, úsalo; si no, deja el texto por defecto
          this.nombreInstitucion = institucion.nombreComercial?.trim() ? institucion.nombreComercial : "ACADEMINIA IPD";
        }
      },
      error: (err) => {
        this.logourl = "https://res.cloudinary.com/dpumt2sth/image/upload/v1760922675/logo_academia_1_flddol.png";
        this.nombreInstitucion = "ACADEMINIA IPD";
      },
    });
  }

  private loadScript(url: string, callback: () => void) {
    const script = this.renderer2.createElement("script");
    script.src = url;
    script.type = "text/javascript";
    script.onload = callback;
    this.renderer2.appendChild(this._document.body, script);
  }

  private procesarMenu(menus: Menu[]): void {
    menus.forEach((menu) => {
      this.menusDropdown.push(menu);
    });
  }

  logoinstitucion(): string {
    return this.logourl;
  }
  nombreinstitucion(): string {
    return this.nombreInstitucion;
  }

  confirmLogout() {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
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
