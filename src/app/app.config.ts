import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient,withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from './environments/environment';
import { ServerErrorInterceptor } from './intercepto/server-error.interceptor';
import { provideToastr} from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export function tokenGetter(){
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideToastr( ),
    provideAnimations(),
    provideHttpClient(), //Registro de módulo HTTP
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true
    },
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["localhost:8080"],
          disallowedRoutes: ["http://localhost:8080/login/forget"],
        },
      }),
    ), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};
