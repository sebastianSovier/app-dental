import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStatus } from '@interfaces/auth-status.enum';
import { AuthService } from '@services/auth.service';
import { LoadingPageService } from '@services/loading-page.service';
import { SweetAlertService } from '@services/sweet-alert.service';
import { UserDataService } from '@services/user-data.service';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const sweetAlert = inject(SweetAlertService);
  const currentUser = inject(UserDataService);
  const loadingService = inject(LoadingPageService);
  if (currentUser.currentUser()?.token !== null && currentUser.currentUser()?.token.length! > 0 && authService.authStatus() === AuthStatus.authenticated && authService.token !== null && authService.token?.toString().length > 0 &&authService.xsrfToken !== null  &&authService.xsrfToken?.toString().length > 0 && currentUser.currentPortal()?.type_page !== null && currentUser.currentPortal()?.type_page.length! > 0) {
    const destinationUrl = state.url;
    if((destinationUrl.includes("evaluar-atencion-page") || destinationUrl.includes("crear-contrasena-page") || destinationUrl.includes("visualizar-examenes-page")
      ||destinationUrl.includes("agendamiento-usuario-page")) && currentUser.currentPortal()?.type_page !== "Paciente"){
      logout();
      return false;

    }
    if((destinationUrl.includes("crear-profesional-page") || destinationUrl.includes("administrador-page")) && currentUser.currentPortal()?.type_page !== "Administrador"){
      logout();
      return false;
    }
    if(((destinationUrl.includes("gestionar-agenda-profesional-page") || destinationUrl.includes("carga-examenes-page") || destinationUrl.includes("consulta-medica-page"))  && currentUser.currentPortal()?.type_page !== "Profesional")){
      logout();
      return false;
    }
    
    if(destinationUrl.includes("ver-tratamiento-consulta-page") && (currentUser.currentPortal()?.type_page !== "Profesional" && currentUser.currentPortal()?.type_page !== "Paciente")){
      logout();
      return false;
    }
    return true;
}else{
 logout();
  return false;

}

function logout(){
  loadingService.setLoading(false);
   authService.logoutService().subscribe({
        next: () => {router.navigate(["/inicio"]);
      sweetAlert.showSweetAlert("errors.validations", "userNoValidate");
          return false;},
        error: () => {router.navigate(["/inicio"]);
      sweetAlert.showSweetAlert("errors.validations", "userNoValidate");
          return false;}
      });
}

};


