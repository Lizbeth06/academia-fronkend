import { Routes } from "@angular/router";
import { LoginComponent } from "./layout/auth-layout/login.component";
import { Not403Component } from "./shared/components/not-403/not-403.component";
import { MainlayoutComponent } from "./layout/main-layout/mainlayout.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "admin",
    component: MainlayoutComponent,
    //   canActivate: [authGuard,activeGuard,certGuard],
    loadChildren: () => import("./admin-academia/admin.routes").then((m) => m.ADMIN_ROUTES),
  },
  {
    path: "not-403",
    component: Not403Component,
  },
  {
    path: "**",
    redirectTo: "admin",
  },
];
