import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { alternativaPreguntasInicialesResponse, crearProfesionalResponse, eliminarCitaPaciente,horasAgendadasPorDoctor, horasAgendadasPorPaciente, imagenExamenConsulta, obtenerTratamientoConsultaPaciente, preguntasInicialesResponse, profesionalesPuntuacion, profesionalesResponse, tokenResponse, usuariosResponse } from '@interfaces/personal-data-request.interface';
import { LoadingPageService } from './loading-page.service';
import { UserDataService } from './user-data.service';
import { environment } from '../../environments/environment';
import { crearAgendamientoPaciente, crearContrasenaPaciente, guardarConsultaMedica, guardarPuntuacionAtencionPaciente, modificarAgendamientoPaciente, okResponse, PacienteRequest, respuestasPreguntas } from '@interfaces/services.interface';
import { LoginResponse } from '@interfaces/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonalServiceService {

  private http = inject(HttpClient);
  private readonly authService = inject(AuthService)
  private loadingService = inject(LoadingPageService);
  private readonly insuredData = inject(UserDataService);
  constructor() { 
  }



  fetchXsrfToken() {
    
    const apiUrl = `${environment.apiUrl}/Authentication/token`;
    const body = {
    };
    return this.http.post<tokenResponse>(apiUrl, body)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }


  obtenerPreguntasIniciales(): Observable<preguntasInicialesResponse[]> {
    const apiUrl = `${environment.apiUrl}/Utilitario/obtenerPreguntasIniciales`;



    return this.http.post<preguntasInicialesResponse[]>(apiUrl, {})
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  
  
  obtenerAlternativaPreguntasIniciales(): Observable<alternativaPreguntasInicialesResponse[]> {
    const apiUrl = `${environment.apiUrl}/Utilitario/obtenerAlternativaPreguntasIniciales`;



    return this.http.post<alternativaPreguntasInicialesResponse[]>(apiUrl, {})
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  obtenerProfesionales(): Observable<profesionalesResponse[]> {
    const apiUrl = `${environment.apiUrl}/Profesional/obtenerProfesionales`;



    return this.http.post<profesionalesResponse[]>(apiUrl, {})
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  obtenerRecomendacionesProfesionales(): Observable<profesionalesResponse[]> {
    const apiUrl = `${environment.apiUrl}/Profesional/obtenerRecomendacionesProfesionales`;



    return this.http.post<profesionalesResponse[]>(apiUrl, {})
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  modificarPerfilUsuario(modificarPerfilRequest:any): Observable<LoginResponse> {
    const apiUrl = `${environment.apiUrl}/Authentication/modificarPerfilUsuario`;



    return this.http.post<LoginResponse>(apiUrl, modificarPerfilRequest)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  derivarAgendamientoPaciente(derivarPacienteRequest:any): Observable<LoginResponse> {
    const apiUrl = `${environment.apiUrl}/Paciente/modificarDerivacionAgendamientoPaciente`;



    return this.http.post<LoginResponse>(apiUrl, derivarPacienteRequest)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  obtenerDatosPaciente(): Observable<PacienteRequest> {
    const apiUrl = `${environment.apiUrl}/Authentication/obtenerDatosPaciente`;



    return this.http.post<PacienteRequest>(apiUrl, {})
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  obtenerUsuarios(): Observable<usuariosResponse> {
    const apiUrl = `${environment.apiUrl}/Authentication/obtenerUsuarios`;



    return this.http.post<usuariosResponse>(apiUrl, {})
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  eliminarUsuario(rut:string): Observable<LoginResponse> {
    const apiUrl = `${environment.apiUrl}/Authentication/eliminarUsuario`;
    const body ={
      rut:rut
    }
    return this.http.post<LoginResponse>(apiUrl, body)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  obtenerDiaSinDisponibilidadPorDoctor(request:any): Observable<horasAgendadasPorDoctor[]> {
    const apiUrl = `${environment.apiUrl}/Profesional/obtenerDiaSinDisponibilidadPorDoctor`;



    return this.http.post<horasAgendadasPorDoctor[]>(apiUrl, request)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  obtenerHorasAgendadasPorDoctor(request:any): Observable<horasAgendadasPorDoctor[]> {
    const apiUrl = `${environment.apiUrl}/Profesional/obtenerHorasAgendadasPorProfesional`;



    return this.http.post<horasAgendadasPorDoctor[]>(apiUrl, request)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  
  modificarDisponibilidadDoctor(request:any): Observable<horasAgendadasPorDoctor[]> {
    const apiUrl = `${environment.apiUrl}/Profesional/modificarDisponibilidadPorProfesional`;



    return this.http.post<horasAgendadasPorDoctor[]>(apiUrl, request)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }

  obtenerHorasAgendadasPorPaciente(): Observable<horasAgendadasPorPaciente[]> {
    const apiUrl = `${environment.apiUrl}/Paciente/obtenerHorasAgendadasPorPaciente`;



    return this.http.post<horasAgendadasPorPaciente[]>(apiUrl, {})
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  obtenerHistoricoHorasAgendadasPorDoctor(request:any): Observable<horasAgendadasPorDoctor[]> {
    const apiUrl = `${environment.apiUrl}/Profesional/obtenerHistoricoHorasAgendadasPorProfesional`;



    return this.http.post<horasAgendadasPorDoctor[]>(apiUrl, request)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  obtenerHistoricoHorasAgendadasPorPaciente(): Observable<horasAgendadasPorPaciente[]> {
    const apiUrl = `${environment.apiUrl}/Paciente/obtenerHistoricoHorasAgendadasPorPaciente`;



    return this.http.post<horasAgendadasPorPaciente[]>(apiUrl, {})
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  obtenerProfesionalesPuntuacion(): Observable<profesionalesPuntuacion[]> {
    const apiUrl = `${environment.apiUrl}/Profesional/obtenerProfesionalesPuntuacion`;



    return this.http.post<profesionalesPuntuacion[]>(apiUrl, {})
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  obtenerExamenesConsulta(obtenerImagenRequest:any): Observable<imagenExamenConsulta[]> {
    const apiUrl = `${environment.apiUrl}/Profesional/obtenerExamenesConsulta`;



    return this.http.post<imagenExamenConsulta[]>(apiUrl, obtenerImagenRequest)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  obtenerExamenesConsultaPaciente(obtenerImagenRequest:any): Observable<imagenExamenConsulta[]> {
    const apiUrl = `${environment.apiUrl}/Paciente/obtenerExamenesConsultaPaciente`;



    return this.http.post<imagenExamenConsulta[]>(apiUrl, obtenerImagenRequest)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  eliminarAgendamientoPaciente(request:eliminarCitaPaciente): Observable<LoginResponse> {
    const apiUrl = `${environment.apiUrl}/Paciente/eliminarAgendamientoPaciente`;



    return this.http.post<LoginResponse>(apiUrl, request)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  confirmarAgendamientoPaciente(request:eliminarCitaPaciente): Observable<LoginResponse> {
    const apiUrl = `${environment.apiUrl}/Paciente/ConfirmarAgendamientoPaciente`;



    return this.http.post<LoginResponse>(apiUrl, request)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  obtenerTratamientoConsultaPaciente(request:any): Observable<obtenerTratamientoConsultaPaciente[]> {
    const apiUrl = `${environment.apiUrl}/ConsultaMedica/obtenerTratamientoConsultaMedica`;



    return this.http.post<obtenerTratamientoConsultaPaciente[]>(apiUrl, request)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  crearProfesional(request:crearProfesionalResponse): Observable<LoginResponse> {
    const apiUrl = `${environment.apiUrl}/Authentication/crearProfesional`;



    return this.http.post<LoginResponse>(apiUrl, request)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  guardarPreguntasIniciales(respuestasRequest:respuestasPreguntas[]): Observable<LoginResponse> {
    const apiUrl = `${environment.apiUrl}/Paciente/guardarRespuestasPersonales`;



    return this.http.post<LoginResponse>(apiUrl, respuestasRequest)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  guardarAgendamientoPaciente(AgendamientoPaciente:crearAgendamientoPaciente): Observable<okResponse> {
    const apiUrl = `${environment.apiUrl}/Paciente/agendamientoPaciente`;



    return this.http.post<okResponse>(apiUrl, AgendamientoPaciente)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  modificarAgendamientoPaciente(AgendamientoPaciente:modificarAgendamientoPaciente): Observable<okResponse> {
    const apiUrl = `${environment.apiUrl}/Paciente/modificarAgendamientoPaciente`;



    return this.http.post<okResponse>(apiUrl, AgendamientoPaciente)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  guardarPuntuacionAtencionPaciente(guardarPuntuacion:guardarPuntuacionAtencionPaciente): Observable<okResponse> {
    const apiUrl = `${environment.apiUrl}/Paciente/guardarPuntuacionAtencionDoctor`;



    return this.http.post<okResponse>(apiUrl, guardarPuntuacion)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  guardarConsultaMedica(guardarConsultaMedica:guardarConsultaMedica): Observable<okResponse> {
    const apiUrl = `${environment.apiUrl}/Profesional/guardarConsultaMedica`;



    return this.http.post<okResponse>(apiUrl, guardarConsultaMedica)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  CargarImagenesExamenes(formData:FormData,id_agendamiento:number): Observable<okResponse> {
    const apiUrl = `${environment.apiUrl}/Profesional/cargarImagenExamen?id_agendamiento=${id_agendamiento}`;



    return this.http.post<okResponse>(apiUrl, formData)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
  crearContrasenaPaciente(CrearContrasenaPaciente:crearContrasenaPaciente): Observable<LoginResponse> {
    const apiUrl = `${environment.apiUrl}/Authentication/CrearPasswordPaciente`;



    return this.http.post<LoginResponse>(apiUrl, CrearContrasenaPaciente)
      .pipe(
        map((data) => data),
        catchError(err => throwError(() => err))
      )
  }
}
