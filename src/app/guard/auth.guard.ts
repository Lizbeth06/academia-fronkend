import { inject } from "@angular/core"
import { LoginService } from "../services/login.service"
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../environments/environment";


export const authGuard = () =>{
    const loginService = inject(LoginService);
    const router = inject(Router);
    const helper = inject(JwtHelperService);

    //1) Verificar si el usuario está logeado
    const result = loginService.isLogged();
    if(!result){
        loginService.logout();
        return false;
    }else{
        //2) Verificar si el token no ha expirado
        const token = sessionStorage.getItem(environment.TOKEN_NAME);
        if (helper.isTokenExpired(token)){
            loginService.logout();
            return false;
        }
    }
    
    return true


}