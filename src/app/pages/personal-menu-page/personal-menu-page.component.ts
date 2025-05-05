import { Component, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingPageService } from '@services/loading-page.service';
import { PreventService } from '@services/prevent.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { UserDataService } from '@services/user-data.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-personal-menu-page',
  imports: [MatIconModule,MatCardModule,MatButtonModule],
  templateUrl: './personal-menu-page.component.html',
  styleUrl: './personal-menu-page.component.scss'
})
export class PersonalMenuPageComponent implements OnInit {

  private loadingService = inject(LoadingPageService);

  private readonly authSession = inject(UserDataService);
  
  isButtonEnabled: boolean = false;
  buttonClicked: boolean = false;
  divVisible: boolean = false;
  private router = inject(Router);
  acceptTermsForm: FormGroup;
  private prevent = inject(PreventService);
  disabled = this.loadingService.submitButtonDisabled$;
  titulo: string;
  esPaciente: boolean = false;

  ngOnDestroy() {}
  constructor() {

  }
  ngOnInit() {
    this.prevent.preventBackButton();
    this.loadingService.setLoading(false);
    this.titulo = this.authSession.currentPortal()?.type_page === "Paciente" ? "Mis atenciones médicas" : "Gestión de atenciones médicas";
    this.esPaciente = this.authSession.currentPortal()?.type_page === "Paciente" ? true : false;
  }

  goToNuevaHora(){
    if(this.authSession.currentPortal()?.type_page === "Paciente"){
      this.router.navigate(["/agendamiento-usuario-page"]);
    }
  }
  goToProximasAtenciones(){
    this.router.navigate(["/proximas-atenciones-page"]);
  }
  goToHistorial(){
    this.router.navigate(["/historial-atenciones-page"]);
  }
}
export default PersonalMenuPageComponent;
