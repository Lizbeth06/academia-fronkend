import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { LoginService } from "../services/login.service";
import { UsuarioService } from "../services/usuario.service";
import { map } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { environment } from "../environments/environment";

export const activeGuard = () =>{
    const loginService = inject(LoginService);
    const router = inject(Router);
    const helper = inject(JwtHelperService);
    const usuarioService = inject(UsuarioService);
    const _snackBar = inject(MatSnackBar);

    //1) Verificar si el usuario está activo
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodeToken = helper.decodeToken(token!);
    const username = decodeToken.sub;
    return usuarioService.findByUsername(username).pipe(map(data=>{
        if(!data.isActive){
            loginService.logout();
            _snackBar.open('El usuario está desactivado. Comuníquese con el administrador para mayor información', 'Ok', {duration:7500});
        }
        
        return data.isActive;
    }));
}