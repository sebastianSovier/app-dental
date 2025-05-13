import { computed, inject, Injectable, signal } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthStatus } from "@interfaces/auth-status.enum";
import { LoginResponse } from "@interfaces/login-response.interface";
import { UserDataService } from "./user-data.service";
import { emptyResponse } from "@interfaces/personal-data-request.interface";
import { HttpClient } from "@angular/common/http";
import { InsuredUser, PacienteRequest } from "@interfaces/services.interface";
import { CurrentPortal } from "@interfaces/currentPortal.interface";
import { SweetAlertService } from "./sweet-alert.service";


@Injectable({
  providedIn: "root",
})
export class AuthService {

  constructor(private http: HttpClient) {
    this.checkAuthStatus().subscribe();
  }


  private readonly insuredData = inject(UserDataService);
  private readonly sweetAlert = inject(SweetAlertService);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  private _token = signal<string | null>(null);
  private _xsrfToken = signal<string | null>(null);
  public authStatus = computed(() => this._authStatus());
  public token = computed(() => this._token());
  public xsrfToken = computed(() => this._xsrfToken());

  private setAuthentication(loginResponse: LoginResponse): any {
    const { access_Token,id,login,auth,message } = loginResponse;
    if(!access_Token || !auth ) {

      this._authStatus.set(AuthStatus.notAuthenticated);
      this._token.set(null);
       if (message && message.length > 0 && message ==="Agende hora a traves de su portal privado."){
        this.sweetAlert.showSweetAlert("errors", "passwordExiste");
        return false;
      }
      this.logoutService().subscribe({
        next: () => {
      this.sweetAlert.showSweetAlert("errors.validations", "userNoValidate")
    return false},
        error: () => {this.sweetAlert.showSweetAlert("errors.validations", "userNoValidate")
    return false}
      });
      return false;
    }
   
    this._token.set(access_Token);  
    this._authStatus.set(AuthStatus.authenticated);
    sessionStorage.setItem("accessToken", access_Token);
    const portal: CurrentPortal = {
      type_page:
        id === 1
          ? "Paciente"
          : id === 2
          ? "Profesional"
          : id === 3
          ? "Administrador"
          : "Sin definir",
          login:login
    };
    this.insuredData.setTypePage(portal);
    const user : InsuredUser = {
      token: access_Token,
      retry: 0,
      idAgendamiento: "",
    }
    this.insuredData.setInsuredUser(user);
       if(message && message.length > 0 && message === "Cree contraseña para continuar.") {
        this.sweetAlert.showSweetAlert("errors", "creeContrasena");
        return {message:message,auth:false};
      }
    return true;
  }
  public setXsrfToken(token: string): boolean {
    this._xsrfToken.set(token);
    return true;
  }
  loginPacientes(loginRequest:any): Observable<any> {
    const url = `${environment.apiUrl}/Authentication/loginPaciente`;


    return this.http.post<LoginResponse>(url, loginRequest).pipe(
      map((response) => this.setAuthentication(response)),
      catchError((err) =>
        throwError(() => {
          console.log({ err });
          return "Error en servidor. Por favor, intente más tarde.";
        })
      )
    );
  }
  withoutLoginPacientes(loginRequest:any): Observable<any> {
    const url = `${environment.apiUrl}/Authentication/withoutLoginPaciente`;


    return this.http.post<LoginResponse>(url, loginRequest).pipe(
      map((response) => this.setAuthentication(response)),
      catchError((err) =>
        throwError(() => {
          console.log({ err });
          return "Error en servidor. Por favor, intente más tarde.";
        })
      )
    );
  }
  loginProfesional(loginRequest:any): Observable<boolean> {
    const url = `${environment.apiUrl}/Authentication/loginProfesional`;


    return this.http.post<LoginResponse>(url, loginRequest).pipe(
      map((response) => this.setAuthentication(response)),
      catchError((err) =>
        throwError(() => {
          console.log({ err });
          return "Error en servidor. Por favor, intente más tarde.";
        })
      )
    );
  }
  crearPaciente(crearPacienteRequest:PacienteRequest): Observable<LoginResponse> {
    const url = `${environment.apiUrl}/Authentication/crearPaciente`;


    return this.http.post<LoginResponse>(url, crearPacienteRequest)
         .pipe(
           map((data) => data),
           catchError(err => throwError(() => err))
         )
  }
  logout() {
    this._authStatus.set(AuthStatus.notAuthenticated);
    this._token.set(null);
    this.insuredData.resetData();
    const itemsSession = ["accessToken"];
    itemsSession.forEach((item) => sessionStorage.removeItem(item));
    this._xsrfToken.set(null);
    document.cookie = 'Q=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    const itemsLocal = ["accessToken"];
    itemsLocal.forEach((item) => localStorage.removeItem(item));
    return true;
  }

   logoutService() {
      const apiUrl = `${environment.apiUrl}/Authentication/logout`;
      const body = {
      };
      return this.http.post<emptyResponse>(apiUrl, body)
        .pipe(
          map((data) => this.logout()),
          catchError(err => throwError(() => this.logout()))
        )
    }

  checkAuthStatus(): Observable<boolean> {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      this.logout();
      return of(false);
    }

    this._authStatus.set(AuthStatus.authenticated);
    this._token.set(token);
    return of(true);
  }
}
