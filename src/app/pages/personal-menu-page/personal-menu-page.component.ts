import { Component, inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingPageService } from '@services/loading-page.service';
import { PreventService } from '@services/prevent.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-personal-menu-page',
  imports: [MatIconModule,MatCardModule],
  templateUrl: './personal-menu-page.component.html',
  styleUrl: './personal-menu-page.component.scss'
})
export class PersonalMenuPageComponent implements OnInit {

  private loadingService = inject(LoadingPageService);

  
  isButtonEnabled: boolean = false;
  buttonClicked: boolean = false;
  divVisible: boolean = false;
  private router = inject(Router);
  acceptTermsForm: FormGroup;
  private prevent = inject(PreventService);
  disabled = this.loadingService.submitButtonDisabled$;

  ngOnDestroy() {}
  constructor() {

  }
  ngOnInit() {
    this.prevent.preventBackButton();
    this.loadingService.setLoading(false);
  }

  goToNuevaHora(){
    this.router.navigate(["/agendamiento-usuario-page"]);
  }
  goToProximasAtenciones(){
    this.router.navigate(["/proximas-atenciones-page"]);
  }
  goToHistorial(){
    this.router.navigate(["/historial-atenciones-page"]);
  }
}
export default PersonalMenuPageComponent;
