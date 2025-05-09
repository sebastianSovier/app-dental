import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStatus } from '@interfaces/auth-status.enum';
import { AuthService } from '@services/auth.service';
import { SweetAlertService } from '@services/sweet-alert.service';
import { UserDataService } from '@services/user-data.service';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const sweetAlert = inject(SweetAlertService);
  const currentUser = inject(UserDataService);
  if (currentUser.currentUser()?.token !== null && currentUser.currentUser()?.token.length! > 0 && authService.authStatus() === AuthStatus.authenticated && authService.token !== null && authService.token?.toString().length > 0 &&authService.xsrfToken !== null  &&authService.xsrfToken?.toString().length > 0 && currentUser.currentPortal()?.type_page !== null && currentUser.currentPortal()?.type_page.length! > 0) {
    const destinationUrl = state.url;
    if(destinationUrl.includes("evaluar-atencion-page") && currentUser.currentPortal()?.type_page !== "Paciente"){
      logout();
      return false;

    }
    if((destinationUrl.includes("crear-profesional-page") || destinationUrl.includes("administrador-page")) && currentUser.currentPortal()?.type_page !== "Administrador"){
      logout();
      return false;
    }
    if((destinationUrl.includes("gestionar-agenda-profesional-page")  && currentUser.currentPortal()?.type_page !== "Profesional")){
      logout();
      return false;
    }
    return true;
}else{
 logout();
  return false;

}

function logout(){
   authService.logoutService().subscribe({
        next: () => { router.navigate(["/inicio"]);sweetAlert.showSweetAlert("errors.validations", "userNoValidate");
          return false;},
        error: () => { router.navigate(["/inicio"]);
          return false;}
      });
}

};


