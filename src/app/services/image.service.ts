import { HttpClient, HttpParams } from "@angular/common/http";
import { TokenService } from "./token.service";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ImageService {
  apiUrl = environment.HOST;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {}

  createImage(file: File, folder: string): Observable<any> {
    const token: string = this.tokenService.getToken() ?? "";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    return this.http.post<any>(`${this.apiUrl}/api/images/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
