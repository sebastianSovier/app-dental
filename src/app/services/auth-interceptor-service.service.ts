import { Injectable, inject } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, throwError, EMPTY } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { SweetAlertService } from "./sweet-alert.service";
import { UserDataService } from "./user-data.service";

import { LoadingPageService } from "./loading-page.service";
import { PersistFormDataService } from "./persist-form-data.service";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorServiceService implements HttpInterceptor {
  private readonly MAX_RELOAD_ATTEMPTS = 5;
  private reloadCount = 0;
  private loadingService = inject(LoadingPageService);
  private sweetAlertService = inject(SweetAlertService);
  private authService = inject(AuthService);
  private UserDataService = inject(UserDataService);
  private formService = inject(PersistFormDataService);
  key: CryptoKey;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const clonedRequest = this.addAuthHeader(req.clone({ body: req.body }));
  
    if (this.reloadCount >= this.MAX_RELOAD_ATTEMPTS) {
      this.resetReloadCountAfterDelay();
      return EMPTY;
    }
  
    return next.handle(clonedRequest).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.body) {
            return event.clone({ body: event.body });   
        }
        return event;
      }),
      catchError((err: HttpErrorResponse) => this.handleError(err, clonedRequest))
    );
    }

  private addAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
    const xsrfToken = this.authService.xsrfToken();
  const isImageUpload = req.url.includes('/cargarImagenExamen'); 

  const headers: { [name: string]: string } = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${this.authService.token()}`,
    'X-Q': xsrfToken || ''
  };

  if (!isImageUpload) {
    headers['Content-Type'] = 'application/json';
  }

  return req.clone({
    withCredentials: true,
    setHeaders: headers
  });
  }

  private handleError(err: HttpErrorResponse, request: HttpRequest<any>): Observable<never> {
    // Manejo de errores
    this.loadingService.setLoading(false);
    switch (err.status) {
      case 400:
        this.sweetAlertService.showSweetAlert("reintentar", "error");
        break;
        case 409:
        this.sweetAlertService.showSweetAlert("error", "passwordExiste");
        break;
      case 401:
        this.handleUnauthorize(err, request);
        break;
      case 403:
        this.handleUnauthorizedOrForbidden(err, request);
        break;
      case 500:
        this.sweetAlertService.showSweetAlert("reintentar", "error");
        break;
      default:
        this.handleDefaultError(err, request);
        break;
    }
    return throwError(() => new Error(err.message));
  }

  private handleDefaultError(err: HttpErrorResponse, request: HttpRequest<any>): Observable<never> {
    this.authService.logout();
    
    sessionStorage.clear();
    this.sweetAlertService.showSweetAlert("reintentar", "errorDefault");
    this.loadingService.setLoading(false);
    return throwError(() => new Error(err.message));
  }

  private handleUnauthorizedOrForbidden(err: HttpErrorResponse, request: HttpRequest<any>): Observable<never> {
    this.authService.logoutService();
    this.UserDataService.resetData();
    
    sessionStorage.clear();
    this.sweetAlertService.showSweetAlert("errors.service", "timeoutsession");
    this.loadingService.setLoading(false);
    return throwError(() => new Error(err.message));
  }
  private handleUnauthorize(err: HttpErrorResponse, request: HttpRequest<any>): Observable<never> {
    this.authService.logoutService();
    this.UserDataService.resetData();
    
    sessionStorage.clear();
    this.sweetAlertService.showSweetAlert("errors", "loginIncorrecto");
    this.loadingService.setLoading(false);
    return throwError(() => new Error(err.message));
  }
  private resetReloadCountAfterDelay(): void {
    setTimeout(() => {
      this.reloadCount = 0;
    }, 10000);
  }
}
