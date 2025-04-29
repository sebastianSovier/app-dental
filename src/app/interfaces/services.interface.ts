import { tratamiento } from "./personal-data-request.interface";

export interface InsuredUser {
  token: string;
  retry: number;
  idAgendamiento:string;
  createPaciente?:boolean;
}
export interface PacienteRequest {
  rut: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  fecha_nacimiento: string;
  telefono: string;
  correo: string;
  direccion: string;
  dv:string;
}
export interface TokenResponse {
  token: string;
}
export interface ImagenPreview {
  url: string;
  nombre: string;
  tamanoKB: number;
  archivo:File|null;
}
export interface alternativasPreguntas {
  id_pregunta: number;
  id_respuesta: number;
  respuesta: string;
}
export interface respuestasPreguntas {
  id_pregunta: number;
  respuesta: string;
}
export interface okResponse {
  auth: boolean;
}
export interface crearAgendamientoPaciente {
  id_profesional: string;
  fecha: string;
  hora: string;
}
export interface modificarAgendamientoPaciente {
  id_profesional: string;
  id_agendamiento: string;
  fecha: string;
  hora: string;
}
export interface guardarConsultaMedica {
  id_agendamiento :string;
  motivo_consulta :string;
  observaciones :string;
  tratamientos :tratamiento[];
}
export interface guardarPuntuacionAtencionPaciente {
   id_agendamiento:string;
   id_paciente:string;
   id_profesional:string;
   recomendacion:string;
   claridad:string;
   puntualidad:string;
   empatia:string;
   cordialidad:string;
   nivel_satisfaccion:string;
}
export interface crearContrasenaPaciente {
 contrasena:string;
}