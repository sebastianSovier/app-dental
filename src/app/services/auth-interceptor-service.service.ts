import { Injectable, inject } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, throwError, from, of } from "rxjs";
import {  catchError, map, switchMap } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { SweetAlertService } from "./sweet-alert.service";
import { UserDataService } from "./user-data.service";

import { LoadingPageService } from "./loading-page.service";
import { PersistFormDataService } from "./persist-form-data.service";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";


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
  private route = inject(Router);

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isFormData = req.body instanceof FormData;

  if (!environment.useEncrypt || !req.body || isFormData) {
    const authReq = this.addAuthHeader(req);
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

    return from(this.importKey()).pipe(
      switchMap(key =>
        from(this.encrypt(JSON.stringify(req.body), key)).pipe(
         switchMap(encBody => {
  let encryptedReq = req.clone({ body: encBody });

  encryptedReq = this.addAuthHeader(encryptedReq);

  return next.handle(encryptedReq);
})
        )
      ),
      switchMap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.body && event.body.data) {
          return from(this.importKey()).pipe(
            switchMap(key => from(this.decrypt(event.body.data, key))),
            map(decrypted => {
              try {
                const json = JSON.parse(decrypted);
                return event.clone({ body: json });
              } catch {
                return event.clone({ body: decrypted });
              }
            })
          );
        }
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
    
  }

  private addAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
    const xsrfToken = this.authService.xsrfToken();
  const isImageUpload = req.url.includes('/cargarImagenExamen'); 

  const headers: { [name: string]: string } = {
  'Accept': 'application/json',
  'X-Q': xsrfToken || ''
};

const token = this.authService.token();
if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}

  if (!isImageUpload) {
    headers['Content-Type'] = 'application/json';
  }

  return req.clone({
    withCredentials: true,
    setHeaders: headers
  });
  }

  private handleError(err: HttpErrorResponse, request?: HttpRequest<any>): Observable<never> {
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

  private handleDefaultError(err: HttpErrorResponse, request?: HttpRequest<any>): Observable<never> {
    this.authService.logoutService();
    
    sessionStorage.clear();
    this.sweetAlertService.showSweetAlert("reintentar", "errorDefault");
    this.loadingService.setLoading(false);
    return throwError(() => new Error(err.message));
  }

  private handleUnauthorizedOrForbidden(err: HttpErrorResponse, request?: HttpRequest<any>): Observable<never> {
    this.authService.logoutService();
    this.UserDataService.resetData();
    
    sessionStorage.clear();
    this.sweetAlertService.showSweetAlert("errors", "loginIncorrecto");
        this.loadingService.setLoading(false);
    return throwError(() => new Error(err.message));
  }
  private handleUnauthorize(err: HttpErrorResponse, request?: HttpRequest<any>): Observable<never> {
    this.authService.logoutService();
    this.UserDataService.resetData();
    
    sessionStorage.clear();
  
    this.sweetAlertService.showSweetAlert("errors.service", "timeoutsession");
    this.loadingService.setLoading(false);
    
    return throwError(() => new Error(err.message));
  }


  async generateKey(): Promise<CryptoKey> {
  return window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,            
    ['encrypt','decrypt']
  );
}
async exportKey(): Promise<string> {
  const rawKey = Uint8Array.from(atob(environment.keyCripto), c=>c.charCodeAt(0));
  const aesKey = await crypto.subtle.importKey("raw", rawKey, "AES-GCM", true, ["encrypt","decrypt"]);

  const raw = await window.crypto.subtle.exportKey('raw', aesKey);
  return btoa(String.fromCharCode(...new Uint8Array(raw)));
}

async importKey(): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(environment.keyCripto), c=>c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    'raw', raw, { name: 'AES-GCM' }, true, ['encrypt','decrypt']
  );
}
async encrypt(plainText: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);

  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    data
  );

  const buffer = new Uint8Array(iv.byteLength + encrypted.byteLength);
  buffer.set(iv, 0);
  buffer.set(new Uint8Array(encrypted), iv.byteLength);

  return btoa(String.fromCharCode(...buffer));
}
async decrypt(base64: string, key: CryptoKey): Promise<string> {
  const data = Uint8Array.from(atob(base64), c=>c.charCodeAt(0));
  const iv = data.slice(0,12);
  const ciphertext = data.slice(12);

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}
}
