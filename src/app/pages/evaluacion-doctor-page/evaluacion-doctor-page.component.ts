import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSliderModule} from '@angular/material/slider';
import { Router } from '@angular/router';
import { guardarPuntuacionAtencionPaciente } from '@interfaces/services.interface';
import { LoadingPageService } from '@services/loading-page.service';
import { PersonalServiceService } from '@services/personal-service.service';
import { PreventService } from '@services/prevent.service';
import { SweetAlertService } from '@services/sweet-alert.service';
import { UserDataService } from '@services/user-data.service';
import { ValidationsService } from '@services/validations-forms.service';

@Component({
  selector: 'app-evaluacion-doctor-page',
  imports: [ReactiveFormsModule,CommonModule,MatFormFieldModule, MatCardModule,MatInputModule,MatSliderModule,],
  templateUrl: './evaluacion-doctor-page.component.html',
  styleUrl: './evaluacion-doctor-page.component.scss'
})
export class EvaluacionDoctorPageComponent implements OnInit {
  ratingForm: FormGroup;
  private fb = inject(FormBuilder);
  private validationService = inject(ValidationsService);
  private loadingService = inject(LoadingPageService);
  private readonly authSession = inject(UserDataService);
  private readonly router = inject(Router);
  private readonly sweetAlertService = inject(SweetAlertService);
  disabled = this.loadingService.submitButtonDisabled$;
  private ps = inject(PersonalServiceService);
  private prevent = inject(PreventService);
  isValidInput = (fieldName: string | number, form: FormGroup) => this.validationService.isValidInput(fieldName, form);
  errorMessages: Record<string, string> = this.validationService.errorMessages;
  errors = (control: AbstractControl | null) => this.validationService.errors(control);
  loginPacientesForm: FormGroup;
  loginProfesionalForm: FormGroup;
  valueRut: any;
  ratingFields = [
    { controlName: 'puntualidad', label: 'Puntualidad', question: '¿Qué tan puntual fue la atención respecto a la hora agendada?' },
    { controlName: 'empatia', label: 'Empatía', question: '¿Qué tan comprendido/a te sentiste por la persona que te atendió?' },
    { controlName: 'claridad', label: 'Claridad', question: '¿Qué tan claro fue el doctor al explicar tu diagnóstico y el plan de tratamiento?' },
    { controlName: 'recomendacion', label: 'Recomendación', question: '¿Recomendarías a este doctor a familiares y amigos?' },
    { controlName: 'cordialidad', label: 'Cordialidad', question: '¿Qué tan cordial y respetuoso/a fue el trato recibido?' },
    { controlName: 'nivel_satisfaccion', label: 'Nivel de Satisfacción', question: '¿Qué tan satisfecho/a estás con el servicio recibido?' },
  ];
  getFormControl(name: string): FormControl {
    return this.ratingForm.get(name) as FormControl;
  }
  ngOnInit() {
    this.prevent.preventBackButton();
    this.loadingService.setLoading(false);
    if(!this.authSession.currentUser()?.idAgendamiento){
      this.router.navigate(['/historial-atenciones-page']);
    }
  }
  constructor() {
    this.ratingForm = this.fb.group({
      puntualidad: [5, [Validators.required]],
      empatia: [5, [Validators.required]],
      recomendacion: [5, [Validators.required]],
      claridad: [5, [Validators.required]],
      cordialidad: [5, [Validators.required]],
      nivel_satisfaccion: [5, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.ratingForm.valid) {
       this.loadingService.setLoading(true);
            this.loadingService.setDisabledButton(true);
            const crearPuntuacionRequest:guardarPuntuacionAtencionPaciente = { 
              id_agendamiento: this.authSession.currentUser()?.idAgendamiento!.toString()!,
              id_paciente:"",
              id_profesional:"",
              recomendacion:this.ratingForm.value.recomendacion.toString(),
              claridad:this.ratingForm.value.claridad.toString(),
              puntualidad:this.ratingForm.value.puntualidad.toString(),
              empatia:this.ratingForm.value.empatia.toString(),
              cordialidad:this.ratingForm.value.cordialidad.toString(),
              nivel_satisfaccion:this.ratingForm.value.nivel_satisfaccion.toString()
             };
            this.ps.guardarPuntuacionAtencionPaciente(crearPuntuacionRequest).subscribe({
                  next: (response1) => {
                    this.sweetAlertService.showSweetAlert("evaluacion", "exitoso");
                    this.router.navigate(['/historial-atenciones-page']);
                  },
                  error: (error: any) => {
                    console.log(error);
                    this.loadingService.setLoading(false);
                  },
                });

      console.log('Formulario enviado:', this.ratingForm.value);
    }
  }
  volverHistorial(){
    this.loadingService.setLoading(true);
    this.router.navigate(["/historial-atenciones-page"]);
  }

  
}
export default EvaluacionDoctorPageComponent;
