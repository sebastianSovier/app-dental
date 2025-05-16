
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '@services/auth.service';
import { LoadingPageService } from '@services/loading-page.service';
import { PersistFormDataService } from '@services/persist-form-data.service';
import { PersonalServiceService } from '@services/personal-service.service';
import { ValidationsService } from '@services/validations-forms.service';
import { crearContrasenaPaciente } from '@interfaces/services.interface';
import { MatCardModule } from '@angular/material/card';
import { PreventService } from '@services/prevent.service';
import { SweetAlertService } from '@services/sweet-alert.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-crear-cuenta',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule],

  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.scss'
})
export class CrearCuentaComponent implements OnInit {

  private fb = inject(FormBuilder);
  private formDataService = inject(PersistFormDataService);
  private validationService = inject(ValidationsService);
  private loadingService = inject(LoadingPageService);
  private readonly authService = inject(AuthService);
  private sweetAlertService = inject(SweetAlertService);
  disabled = this.loadingService.submitButtonDisabled$;
  private ps = inject(PersonalServiceService);
  private prevent = inject(PreventService);
  isValidInput = (fieldName: string | number, form: FormGroup) => this.validationService.isValidInput(fieldName, form);
  errorMessages: Record<string, string> = this.validationService.errorMessages;
  errors = (control: AbstractControl | null) => this.validationService.errors(control);
  crearCuentaForm: FormGroup;
hidePassword = true;

  constructor(){
    this.crearCuentaForm = this.fb.group(
      {
        contrasena: [null, [Validators.required, Validators.maxLength(20), Validators.minLength(8)]],
        repetirContrasena: [null, [Validators.required,Validators.minLength(8), Validators.maxLength(20)]],
      },
      {
        validators: this.validationService.passwordMatchValidator
      }
    );
  }
  
  ngOnInit() {
    this.loadingService.setLoading(false);
    this.prevent.preventBackButton();
  }
  onSubmitPacientes(crearCuentaForm: FormGroup): void {
    if (crearCuentaForm.valid) {
      this.loadingService.setLoading(true);
      this.loadingService.setDisabledButton(true);
      this.formDataService.setForm("crearCuentaForm", crearCuentaForm);
      const loginRequest:crearContrasenaPaciente = { contrasena: crearCuentaForm.get("contrasena")?.value };
      this.ps.crearContrasenaPaciente(loginRequest).subscribe({
            next: (response1) => {
              console.log(response1);
              this.authService.logout();        
              this.loadingService.setLoading(false);
              this.sweetAlertService.showSweetAlert("crearCuenta","exitoso");
            },
            error: (error: any) => {
              console.log(error);
              this.loadingService.setLoading(false);
            },
          });
    }
  }
}
export default CrearCuentaComponent;

