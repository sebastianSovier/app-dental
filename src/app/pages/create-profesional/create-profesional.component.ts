import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { preguntasInicialesResponse, alternativaPreguntasInicialesResponse, profesionalesResponse, horasAgendadasPorDoctor, crearProfesionalResponse } from '@interfaces/personal-data-request.interface';
import { AuthService } from '@services/auth.service';
import { LoadingPageService } from '@services/loading-page.service';
import { PersistFormDataService } from '@services/persist-form-data.service';
import { PersonalServiceService } from '@services/personal-service.service';
import { PreventService } from '@services/prevent.service';
import { SweetAlertService } from '@services/sweet-alert.service';
import { UserDataService } from '@services/user-data.service';
import { ValidationsService } from '@services/validations-forms.service';
import { rutValidator } from '../../directives/rut-validator';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OnlyNumbersDirective } from '../../directives/only-numbers.directive';
import * as rutHelpers from "rut-helpers";
import { OnlyLettersNumbersDirective } from '../../directives/only-letters-numbers.directive';
import { OnlyLettersDirective } from '../../directives/only-letters.directive';

@Component({
  selector: 'app-create-profesional',
  imports: [MatIconModule, MatTooltipModule, OnlyLettersDirective,OnlyLettersNumbersDirective,OnlyNumbersDirective, MatInputModule,MatButtonModule,MatSelectModule,MatOptionModule, ReactiveFormsModule, FormsModule, CommonModule,MatStepperModule,MatDatepickerModule,MatNativeDateModule ],
  providers: [rutValidator],

  templateUrl: './create-profesional.component.html',
  styleUrl: './create-profesional.component.scss'
})
export class CreateProfesionalComponent implements OnInit {
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
  private readonly rutValidate = inject(rutValidator);
  selectedDate: Date | null = null;
  horasDisponibles: string[] = [];
  reservas: { [date: string]: string[] } = {};
  private sweetAlertService = inject(SweetAlertService);
  @ViewChild('stepper') stepper!: MatStepper;
  isValidInput = (fieldName: string | number, form: FormGroup) => this.validationService.isValidInput(fieldName, form);
  errorMessages: Record<string, string> = this.validationService.errorMessages;
  errors = (control: AbstractControl | null) => this.validationService.errors(control);
  ProfesionalDataForm: FormGroup;
  valueRut: string;
  private prevent = inject(PreventService);
  
  constructor() {
    this.ProfesionalDataForm = this.fb.group(
      {
        rut:  [null, [Validators.required, Validators.maxLength(12), Validators.minLength(7), this.rutValidate]],
        nombres: [null, [Validators.required,Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/),Validators.maxLength(80),Validators.minLength(1)]],
        apellidoPaterno: [null, [Validators.required,Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/),Validators.maxLength(80),Validators.minLength(1)]],
        apellidoMaterno: [null, [Validators.required,Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/),Validators.maxLength(80),Validators.minLength(1)]],
    
 
        correo: [null, [Validators.email, Validators.required, Validators.pattern('^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$'), Validators.minLength(1),Validators.maxLength(60)]],
        telefono: [null, [Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.maxLength(8), Validators.minLength(8)]],
        direccion: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ ]+$/), Validators.minLength(1),Validators.maxLength(40)]],
     
        day: [null, [Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])$/), Validators.max(31),Validators.minLength(2), Validators.maxLength(2)]],
        month: [null, [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/), Validators.max(12),Validators.minLength(2), Validators.maxLength(2)]],
        year: [null, [Validators.required, Validators.pattern(/^\d{4}$/),Validators.minLength(4), Validators.min(1900), Validators.max(new Date().getFullYear()), Validators.maxLength(4)]],
     
      }, { validators: this.validationService.validateDateAndAge() });
}
ngOnInit(): void {
  this.prevent.preventBackButton();
  if(this.authSession.currentPortal()?.type_page !== "Administrador"){
    this.router.navigate(["/login-page"]);
  }

}
onSubmitProfesionalDataForm(ProfesionalDataForm: FormGroup): void {
  if (ProfesionalDataForm.valid) {
    this.loadingService.setLoading(true);
    const createProfesionalRequest:crearProfesionalResponse = {
      rut: ProfesionalDataForm.get("rut")?.value.replace(/\./g, "").replace("-", ""),
      nombres: ProfesionalDataForm.get("nombres")?.value,
      apellido_paterno: ProfesionalDataForm.get("apellidoPaterno")?.value,
      apellido_materno: ProfesionalDataForm.get("apellidoMaterno")?.value,
      correo: ProfesionalDataForm.get("correo")?.value,
      telefono: ProfesionalDataForm.get("telefono")?.value,
      direccion: ProfesionalDataForm.get("direccion")?.value,
      fecha_nacimiento: `${ProfesionalDataForm.get("year")?.value}-${ProfesionalDataForm.get("month")?.value}-${ProfesionalDataForm.get("day")?.value}`,
      id_especialidad:1,

    };
    this.ps.crearProfesional(createProfesionalRequest).subscribe({
      next: (response1) => {
        this.loadingService.setLoading(false);
        this.router.navigate(["/administrador-page"]);
      },
      error: (error: any) => {
        console.log(error);
        this.loadingService.setLoading(false);
      },
    });
  } else {
  }
}
volverMantenedor(){
  this.router.navigate(["/administrador-page"]);
}
setFormatRut(value: Event) {
  this.valueRut = rutHelpers.rutFormat((value.target as HTMLInputElement).value);
  this.ProfesionalDataForm.controls["rut"].setValue(this.valueRut);
}
}
export default CreateProfesionalComponent;