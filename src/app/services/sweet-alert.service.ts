import { Injectable } from "@angular/core";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { UserDataService } from "./user-data.service";

@Injectable({
  providedIn: "root",
})
export class SweetAlertService {
  constructor(private router: Router, private insuredData: UserDataService) {}

  showSweetAlert(component: string, id: string, exstr: string | null = null, autoclose: boolean = false) {
    if (autoclose) {
      setTimeout(() => {
        Swal.close();
      }, 3000);
    }

    if (component === "all-components" && id === "swalclose") {
      Swal.close();
    }

    if (component === "errors.service" && id === "timeoutsession") {
      Swal.fire({
        html: `<h1>Mensaje Sistema</h1>Su sesión ha caducado`,
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
        customClass: { confirmButton: "btn btn-warning" },
        buttonsStyling: false,
      }).then(() => {
        this.router.navigate(["error-page"]);
      });
    }
    if (component === "errors" && id === "creeContrasena") {
      Swal.fire({
        html: `<h1>Mensaje Sistema</h1>Cree contraseña para continuar.`,
        icon: "warning",
         showConfirmButton: true,
        draggable:false,
        allowOutsideClick:false,
        customClass: { confirmButton: "btn btn-warning" },
        buttonsStyling: true,
      }).then(() => {
        this.router.navigate(["crear-contrasena-page"]);
      });
    }
    if (component === "errors" && id === "poseecuenta") {
      Swal.fire({
        html: `<h1>Mensaje Sistema</h1>Cree contraseña para continuar.`,
        icon: "warning",
         showConfirmButton: true,
        draggable:false,
        allowOutsideClick:false,
        customClass: { confirmButton: "btn btn-warning" },
        buttonsStyling: true,
      }).then(() => {
        this.router.navigate(["crear-contrasena-page"]);
      });
    }
    if (component === "crearCuenta" && id === "exitoso") {
      Swal.fire({
        html: `<h1>Mensaje Sistema</h1>Su cuenta ha sido creada con éxito, será redirigido a la página de inicio sesión.`,
        icon: "success",
        showConfirmButton: false,
        showCancelButton: false,
        timer: 2000,
        buttonsStyling: false,
      }).then(() => {
        this.router.navigate(["/login-page"]);
      });
    }
    if (component === "errors" && id === "passwordExiste") {
      Swal.fire({
        html: `<h1>Mensaje Sistema</h1>Usuario ya posee contraseña , será redirigido a la página de inicio sesión.`,
        icon: "warning",
        showConfirmButton: false,
        timer: 3000,
        customClass: { confirmButton: "btn btn-success" },
        buttonsStyling: false,
      }).then(() => {
        this.router.navigate(["login-page"]);
      });
    }
    if (component === "errors" && id === "loginIncorrecto") {
      Swal.fire({
        html: `<h1>Mensaje Sistema</h1>Credenciales incorrectas`,
        icon: "error",
        showConfirmButton: true,
        draggable:false,
        allowOutsideClick:false,
        customClass: { confirmButton: "btn btn-warning" },
        buttonsStyling: true,
      }).then(() => {

      });
    }
    if (component === "errors.validations" && id === "userNoValidate") {
      Swal.fire({
        html: `<h1>Mensaje Sistema</h1>No puede continuar, Usuario no validado o no habilitado para ingresar.`,
        icon: "error",
        showConfirmButton: true,
        //timer: 2000,
        draggable:false,
        allowOutsideClick:false,
        showCancelButton: false,
        confirmButtonColor: "#d33",
        confirmButtonText: "Entiendo",
      }).then((result) => {
      });
    }
    if (component === "reintentar" && id === "error") {
      Swal.fire({
        html: `
          <div class="loading-container">
            <div class="loading-circle"></div>
          </div>Por favor intente nuevamente`,
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Reintentar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          if (this.insuredData.currentUser()?.retry! >= 3) {
            this.router.navigate(["/error-page"]);
            return;
          } else if (this.insuredData.currentUser()?.retry! < 3) {
            this.insuredData.setRetry();
          } else {
            this.router.navigate(["/error-page"]);
          }
        } else {
          
            this.router.navigate(["/error-page"]);
          
        }
      });
    }
    if (component === "reintentar" && id === "errorDefault") {
      Swal.fire({
        html: `
          <div class="loading-container">
            <div class="loading-circle"></div>
            </div>Intermitencias en la conexion, Por favor reintente mas tarde.`,
        showCancelButton: false,
        confirmButtonColor: "#d33",
        confirmButtonText: "Entiendo",
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(["/error-page"]);
        }
      });
    }
    if (component === "agendamiento" && id === "exitoso") {
      Swal.fire({
        icon: "success",
        title: "Agendamiento exitoso",
        html: this.insuredData.currentPortal()?.type_page === "Paciente"? undefined:`Para seguir tu información y aprovechar más funciones, solo presiona 'Crear contraseña' y crea tu cuenta.`,
        showCancelButton:  this.insuredData.currentPortal()?.type_page === "Paciente" && this.insuredData.currentPortal()?.login === true ?true: false,
        confirmButtonColor: this.insuredData.currentPortal()?.type_page === "Paciente" && this.insuredData.currentPortal()?.login === true ?undefined: "#d33",
        confirmButtonText: this.insuredData.currentPortal()?.type_page === "Paciente" && this.insuredData.currentPortal()?.login === true ? undefined :"crear contraseña",
        showConfirmButton:this.insuredData.currentPortal()?.type_page === "Paciente" && this.insuredData.currentPortal()?.login === true ? false:true,
        draggable:false,
        allowOutsideClick:false,
        cancelButtonColor: "#6c757d",
        cancelButtonText:this.insuredData.currentPortal()?.type_page === "Paciente" && this.insuredData.currentPortal()?.login === true ? "Ir a menu":"Ir a inicio",
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(["/crear-contrasena-page"]);
        }else{
          if(this.insuredData.currentPortal()?.type_page === "Paciente" && this.insuredData.currentPortal()?.login === true){
            this.router.navigate(["/personal-menu-page"]);
            return;
          }
          this.insuredData.resetData();
          this.router.navigate(["/inicio"]);
        }
      });
    }
    if (component === "horaAgendada" && id === "existente") {
      Swal.fire({
        icon: "warning",
        title: "Ya existe una hora agendada",
        confirmButtonText: "Entiendo",
        showConfirmButton:true,
        draggable:false,
        allowOutsideClick:false,
      }).then((result) => {
        if (result.isConfirmed) {
          if(this.insuredData.currentPortal()?.type_page === "Paciente" && this.insuredData.currentPortal()?.login === true){
            this.router.navigate(["/personal-menu-page"]);
            return;
          }
          this.insuredData.resetData();
          this.router.navigate(["/inicio"]);
        }
      });
    }
    if (component === "agendamiento" && id === "modificarDisponibilidad") {
      Swal.fire({
        icon: "success",
        title: "Modificación de disponibilidad exitoso",
        showCancelButton: false,
       
        showConfirmButton:true,
        draggable:false,
        allowOutsideClick:false,
        cancelButtonColor: "#6c757d",
        cancelButtonText:this.insuredData.currentPortal()?.type_page === "Paciente" && this.insuredData.currentPortal()?.login === true ? "Ir a menu":"Ir a inicio",
      }).then((result) => {
            this.router.navigate(["/personal-menu-page"]);
            return;
  
      });
    }
    if (component === "cargaexamenes" && id === "exitoso") {
      Swal.fire({
        icon: "success",
        title: "Carga de examenes realizado correctamente",
        showCancelButton: false,
       
        showConfirmButton:true,
        draggable:false,
        allowOutsideClick:false,
      }).then((result) => {
            this.router.navigate(["/historial-atenciones-page"]);
            return;
  
      });
    }
    if (component === "errors" && id === "CrearContrasena") {
      Swal.fire({
        icon: "warning",
        html: `<h1>Mensaje Sistema</h1>Usuario no puede continuar, por favor comunicarse con call center.`,
        title: "Crear contraseña",
        showCancelButton: false,
        showConfirmButton: false,
        draggable:false,
        timer: 3000,
        allowOutsideClick:false,
      }).then((result) => {
          this.insuredData.resetData();
          this.router.navigate(["/inicio"]);
        
      });
    }
    
    if (component === "modificacion" && id === "exitoso") {
      Swal.fire({
        icon: "success",
        title: "Modificación de agendamiento exitoso",
        showCancelButton: false,
        timer: 2000,
        showConfirmButton: false,
        draggable:false,
        allowOutsideClick:false,
      }).then((result) => {
        this.router.navigate(["/personal-menu-page"]);
      });
    }
    if (component === "evaluacion" && id === "exitoso") {
      Swal.fire({
        icon: "success",
        title: "Evaluación realizada exitosamente",
        showConfirmButton: false,
        timer: 2000,
        draggable:false,
        allowOutsideClick:false,
        showCancelButton:false
      }).then((result) => {
          this.router.navigate(["/historial-atenciones-page"]);
      });
    }
    if (component === "cita_confirmada" && id === "exitoso") {
      Swal.fire({
        icon: "success",
        title: "Cita confirmada exitosamente",
        showConfirmButton: false,
        timer: 2000,
        draggable:false,
        allowOutsideClick:false,
        showCancelButton:false
      });
    }
    return;
  }
}
