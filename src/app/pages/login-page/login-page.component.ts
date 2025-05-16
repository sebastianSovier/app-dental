
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { TokenResponse } from '@interfaces/services.interface';
import { AuthService } from '@services/auth.service';
import { UserDataService } from '@services/user-data.service';
import { LoadingPageService } from '@services/loading-page.service';
import { PersistFormDataService } from '@services/persist-form-data.service';
import { PersonalServiceService } from '@services/personal-service.service';
import { ValidationsService } from '@services/validations-forms.service';
import { EMPTY } from 'rxjs';
import { rutValidator } from '../../directives/rut-validator';
import * as rutHelpers from "rut-helpers";
import { CurrentPortal } from '@interfaces/currentPortal.interface';
import { PreventService } from '@services/prevent.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SweetAlertService } from '@services/sweet-alert.service';

@Component({
  selector: 'app-login-page',
  imports: [MatButtonModule, MatTabsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule, MatIconModule],
  templateUrl: './login-page.component.html',
  providers: [rutValidator],
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent implements OnInit {

  private prevent = inject(PreventService);
  private readonly rutValidate = inject(rutValidator);
  private fb = inject(FormBuilder);
  private formDataService = inject(PersistFormDataService);
  private validationService = inject(ValidationsService);
  private loadingService = inject(LoadingPageService);
  private readonly authSession = inject(UserDataService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  type_page: string | undefined = "";
  disabled = this.loadingService.submitButtonDisabled$;
  private ps = inject(PersonalServiceService);
  private sweetAlert = inject(SweetAlertService);
  isValidInput = (fieldName: string | number, form: FormGroup) => this.validationService.isValidInput(fieldName, form);
  errorMessages: Record<string, string> = this.validationService.errorMessages;
  errors = (control: AbstractControl | null) => this.validationService.errors(control);
  loginPacientesForm: FormGroup;
  loginProfesionalForm: FormGroup;
  valueRut: any;
  tipoPagina: string;
  hidePassword = true;

  constructor() {
    this.loginProfesionalForm = this.fb.group(
      {
        rut: [null, [Validators.required, Validators.maxLength(12), Validators.minLength(7), this.rutValidate]],
        contrasena: [null, [Validators.required,Validators.minLength(8), Validators.maxLength(20)]],
      },
    );
    this.loginPacientesForm = this.fb.group(
      {
        rut: [null, [Validators.required, Validators.maxLength(12), Validators.minLength(7), this.rutValidate]],
        contrasena: [null, [Validators.required,Validators.minLength(8), Validators.maxLength(20)]],
      }
    );
  }

  ngOnInit() {
    this.loadingService.setLoading(false);
    this.prevent.preventBackButton();
  }
  setFormatRut(value: Event) {
    this.valueRut = rutHelpers.rutFormat((value.target as HTMLInputElement).value);
    this.loginPacientesForm.controls["rut"].setValue(this.valueRut);
  }
  setFormatRutProfesional(value: Event) {
    this.valueRut = rutHelpers.rutFormat((value.target as HTMLInputElement).value);
    this.loginProfesionalForm.controls["rut"].setValue(this.valueRut);
  }
  onSubmitPacientes(loginPacientesForm: FormGroup): void {
    if (loginPacientesForm.valid) {
      this.loadingService.setLoading(true);
      this.loadingService.setDisabledButton(true);
      this.formDataService.setForm("loginPacientesForm", loginPacientesForm);
      const rut = loginPacientesForm.get("rut")?.value;
      const loginRequest = { rut: rut.replace(/\./g, "").replace("-", ""), password: loginPacientesForm.get("contrasena")?.value };
      this.authService.loginPacientes(loginRequest).subscribe({
            next: (response1) => {
              if(response1){
                this.getToken();
              }else{
                this.loadingService.setLoading(false);
                this.sweetAlert.showSweetAlert("errors.validations","userNoValidate");
              }
            },
            error: (error: any) => {
              console.log(error);
              this.loadingService.setLoading(false);
            },
          });
    }
  }
  volver(){
    this.router.navigate(["/inicio"]);
  }
  private redirectToError() {
    this.loadingService.setLoading(false);
    this.router.navigate(["/error-page"]);
    return EMPTY;
  }
  private handleTokenResponse(response: TokenResponse) {
    if (response.token) {
      this.authService.setXsrfToken(response.token);
      if(this.authSession.currentPortal()?.type_page === "Paciente") {
      return this.router.navigate(["/personal-menu-page"]);
      } else if(this.authSession.currentPortal()?.type_page === "Profesional") {
        return this.router.navigate(["/personal-menu-page"]);
      }else{
        return this.router.navigate(["/administrador-page"]);
      }
    }
    return this.redirectToError();
  }
  onSubmitProfesional(loginProfesionalForm: FormGroup): void {
    if (loginProfesionalForm.valid) {
      this.loadingService.setLoading(true);
      this.loadingService.setDisabledButton(true);
      this.formDataService.setForm("loginProfesionalFormForm", loginProfesionalForm);
      const rut = loginProfesionalForm.get("rut")?.value;
     const loginRequest = { rut: rut.replace(/\./g, "").replace("-", ""), password: this.loginProfesionalForm.get("contrasena")?.value };
       this.authService.loginProfesional(loginRequest).subscribe({
         next: (response1) => {
           console.log(response1);
           if(response1){
            this.getToken();
          }else{
            this.loadingService.setLoading(false);
            this.sweetAlert.showSweetAlert("errors.validations","userNoValidate");
          }
         },
         error: (error: any) => {
           
           this.loadingService.setLoading(false);
         },
       });
    }
  }
  getToken(){
    this.ps.fetchXsrfToken().subscribe({
      next: (response2) => {
        console.log(response2);
        this.handleTokenResponse(response2)
      },
      error: (error: any) => {
        console.log(error);
        this.loadingService.setLoading(false);
        this.redirectToError();
      },
    });
  }
}
export default LoginPageComponent;

