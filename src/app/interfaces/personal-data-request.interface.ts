export interface preguntasInicialesResponse {
  id_pregunta: string;
  texto: string;
  fecha_registro: string;
}
export interface alternativaPreguntasInicialesResponse {
  id_alternativa_pregunta: string;
  id_pregunta: string;
  id_alternativa_respuesta: string;
  texto: string;
  fecha_registro: string;
}
export interface emptyResponse{
  auth: boolean;
}
export interface profesionalesResponse {
  id_profesional: string;
  rut: string;
  dv: string;
  id_especialidad: string;
  especialidad: string;
  nombres: string;
  
  apellido_paterno: string;

  apellido_materno: string;
  puntaje:string;
  id_perfil:string;
}
export interface crearProfesionalResponse {
  rut: string;
  id_especialidad: number;
  nombres: string;
  fecha_nacimiento: string;
  telefono: string;
  correo: string;
  direccion: string;
  apellido_paterno: string;
  apellido_materno: string;
}


export interface usuariosResponse {
  profesionales: profesionalesResponse[];
  pacientes: profesionalesResponse[];
}

export interface horasAgendadasPorDoctor {
  id_agendamiento: string;
  id_profesional: string;
  fecha: string;
  hora: string;
  consulta_realizada:string;
  estado:string;
}
export interface eliminarCitaPaciente {
  id_agendamiento: string;
}
export interface horasAgendadasPorPaciente {
  id_agendamiento: string;
  especialidad:string;
  fecha: string;
  hora: string;
  id_profesional: string;
  nombres: string;
  consulta_realizada:string
  apellido_paterno: string;
  apellido_materno: string;
  puntuacion_realizada:boolean;
  estado:string;
  id_perfil:string;

}
export interface profesionalesPuntuacion {
   id_profesional:string;

   rut:string;
   dv:string;
   id_especialidad:string;
   especialidad:string;
   nombres:string;

   apellido_paterno:string;

   apellido_materno:string;

   puntaje_general:string;
   recomendacion:string;
   claridad:string;
   puntualidad:string;
   empatia:string;
   cordialidad:string;

   nivel_satisfaccion:string;
}
export interface tratamiento {
  id_tratamiento: string;
  nombre: string;
  descripcion: string;
  valor: string;
}
export interface tokenResponse {
  token: string;
}
export interface imagenExamenConsulta{
 imagen_examen:string;
tamano:string;
 nombre_examen:string;
 mime_type:string;
 fecha_registro:string;
}