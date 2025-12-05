
import { inject } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { map } from "rxjs";
import { Menu } from "../model/menu";
import { environment } from "../environments/environment";
import { MenuService } from "../services/menu.service";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";

export const certGuard = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot)=>{
    const menuService = inject(MenuService);
    const router = inject(Router);

    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);

    const url = state.url;
    const username = helper.decodeToken(token!).sub;

    return menuService.getMenuByUser(username).pipe(map((data:Menu[])=>{
        menuService.setMenuChange(data);
        for(let m of data){
            //console.log(url);
            //console.log(m.url_menu);
            if(url.startsWith(m.url_menu)){
                return true;
            }
        }
        router.navigate(['/not-403']);
        return false;
    }))
}