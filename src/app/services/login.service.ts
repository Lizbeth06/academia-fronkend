import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url : string = `${environment.HOST}/api/auth/login`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(username: string, password: string){
    const body: ILogginRequest = {username, password}
    return this.http.post<any>(this.url, body);
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['login']);
  }

  isLogged(){
    return sessionStorage.getItem(environment.TOKEN_NAME)!= null;
  }
}

export interface ILogginRequest{
  username : string,
  password : string
}
