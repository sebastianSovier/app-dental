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
        html: `<h1>Mensaje Sistema</h1>Usuario ya posee contraseña`,
        icon: "warning",
        showConfirmButton: false,
        timer: 2000,
        customClass: { confirmButton: "btn btn-warning" },
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
        html: `<h1>Mensaje Sistema</h1>No puede continuar, Cliente no validado o no habilitado.`,
        icon: "error",
        showConfirmButton: true,
        //timer: 2000,
        draggable:false,
        allowOutsideClick:false,
        confirmButtonText: "Entiendo",
        customClass: { confirmButton: "btn btn-warning" },
        buttonsStyling: true,
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
        html: this.insuredData.currentPortal()?.type_page === "Paciente"? undefined:`si desea crear una cuenta para realizar seguimiento y mucho mas... presione crear contraseña.`,
        showCancelButton: true,
        confirmButtonColor: this.insuredData.currentPortal()?.type_page === "Paciente" ?undefined: "#d33",
        confirmButtonText: this.insuredData.currentPortal()?.type_page === "Paciente" ? undefined :"crear contraseña",
        showConfirmButton:this.insuredData.currentPortal()?.type_page === "Paciente" ? false:true,
        draggable:false,
        allowOutsideClick:false,
        cancelButtonColor: "#6c757d",
        cancelButtonText: "ir a inicio",
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(["/crear-contrasena-page"]);
        }else{
          this.insuredData.resetData();
          this.router.navigate(["/inicio"]);
        }
      });
    }
    return;
  }
}
