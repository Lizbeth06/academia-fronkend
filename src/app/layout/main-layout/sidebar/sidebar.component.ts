import { ChangeDetectorRef, Component, Inject, inject, OnInit } from "@angular/core";
import { Menu, MenuSubmenu } from "../../../core/model/menu";
import { MenuAgrupado } from "../../../core/model/MenuAgrupado";
import { MaterialModule } from "../../../shared/components/material/material.module";
import { MenuService } from "../../../core/services/menu.service";
import { ItemMenuOptionComponent } from "./menu-option/menu-option.component";
import { CommonModule, TitleCasePipe } from "@angular/common";
import { MenuTreeService } from "../../../core/util/menutree.util";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../../../environments/environment";
import { LoginService } from "../../../core/services/login.service";
import { TokenService } from "../../../core/services/token.service";
import { UsuarioService } from "../../../core/services/usuario.service";
import { RouterLink } from "@angular/router";
import { DataService } from "../../../core/services/data.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-sidebar",
  imports: [CommonModule, MaterialModule, ItemMenuOptionComponent, TitleCasePipe, RouterLink],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.css",
})
export class SidebarComponent implements OnInit {
  constructor(private dataService: DataService) {}

  menusSidebar: MenuSubmenu[] = [];
  private cdRef = inject(ChangeDetectorRef);
  private loginService = inject(LoginService);

  isCollapsed = true;
  isHovered = false;

  ngOnInit() {
    this.obtenerMenus();
  }

  private obtenerMenus() {
    this.cdRef.detectChanges();
    this.dataService.data.subscribe({
      next: (data) => {
        if (!data) return;
        this.menusSidebar = data.filter((m: any) => m.idMenu !== 1);
        console.log(this.menusSidebar);
      },
      error: (err) => console.error(err),
    });
  }

  onSidebarHover(value: boolean) {
    this.isHovered = value;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  logout() {
    this.loginService.logout();
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
}
