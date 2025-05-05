import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {  Router } from '@angular/router';
import { guardarConsultaMedica } from '@interfaces/services.interface';
import { tratamiento } from '@interfaces/personal-data-request.interface';
import { UserDataService } from '@services/user-data.service';
import { LoadingPageService } from '@services/loading-page.service';
import { PersonalServiceService } from '@services/personal-service.service';
import { ValidationsService } from '@services/validations-forms.service';
import { PreventService } from '@services/prevent.service';
import { OnlyNumbersDirective } from '../../directives/only-numbers.directive';

@Component({
  selector: 'app-consulta-medica-page',
  imports: [MatTableModule,OnlyNumbersDirective, MatIconModule, MatCardModule,CommonModule,MatInputModule,MatButtonModule,MatSelectModule,MatOptionModule, ReactiveFormsModule, FormsModule, CommonModule,MatStepperModule,MatDatepickerModule,MatNativeDateModule],
  templateUrl: './consulta-medica-page.component.html',
  styleUrl: './consulta-medica-page.component.scss'
})
export class ConsultaMedicaPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private validationService = inject(ValidationsService);
  private loadingService = inject(LoadingPageService);
  private readonly authSession = inject(UserDataService);
  private readonly router = inject(Router);
  type_page: string | undefined = "";
  disabled = this.loadingService.submitButtonDisabled$;
  private ps = inject(PersonalServiceService);
  private prevent = inject(PreventService);
  isValidInput = (fieldName: string | number, form: FormGroup) => this.validationService.isValidInput(fieldName, form);
  errorMessages: Record<string, string> = this.validationService.errorMessages;
  errors = (control: AbstractControl | null) => this.validationService.errors(control);
  loginPacientesForm: FormGroup;
  loginProfesionalForm: FormGroup;
  valueRut: any;
  tipoPagina: string;
  displayedColumnsPaciente: string[] = [
    'nombre_tratamiento',
    'descripcion',
    'valor',
    'acciones',
  ];
  tratamientos: tratamiento[] = [];

  dataSource = new MatTableDataSource<tratamiento>(
    this.tratamientos
  );
  formConsulta: FormGroup;
  constructor(){
    this.formConsulta = this.fb.group({
      consultaMedicaForm: this.fb.group({
        motivo_consulta: [null, [Validators.required, Validators.minLength(10)]],
        observaciones: [null, [Validators.required, Validators.minLength(8)]],
      }),
      tratamientoForm: this.fb.group({
        nombre_tratamiento: [null, [Validators.required]],
        descripcion: [null, [Validators.required]],
        valor: [null, [Validators.required]],
      }),
    });
  }
  ngOnInit() {
    this.prevent.preventBackButton();
    this.loadingService.setLoading(false);
    if(!this.authSession.currentUser()?.idAgendamiento){
      this.router.navigate(['/proximas-atenciones-page']);
    }
    

  }
  get consultaMedicaForm(): FormGroup {
    return this.formConsulta.get('consultaMedicaForm') as FormGroup;
  }
  
  get tratamientoForm(): FormGroup {
    return this.formConsulta.get('tratamientoForm') as FormGroup;
  }
  eliminarTratamiento(element:tratamiento){
    const index = this.tratamientos.indexOf(element);
    if (index >= 0) {
      this.tratamientos.splice(index, 1);
      this.dataSource.data = this.tratamientos;
    }
 
  }
  getSumaTotal(){
    let suma = 0;
    this.tratamientos.forEach((tratamiento) => {
      suma += Number(tratamiento.valor);
    });
    return suma.toString();
  }
  onSubmitConsultaMedica(){
    if (this.consultaMedicaForm.valid && this.tratamientos.length > 0) {
      this.loadingService.setLoading(true);
      const consultaData = this.consultaMedicaForm.value;
      const tratamientoData = this.tratamientos;
      console.log('Consulta médica:', consultaData);
      console.log('Tratamiento:', tratamientoData);
      const request:guardarConsultaMedica = {
        id_agendamiento: this.authSession.currentUser()?.idAgendamiento!,
        motivo_consulta: consultaData.motivo_consulta,
        observaciones: consultaData.observaciones,
        tratamientos: tratamientoData,
      };
     
      this.ps.guardarConsultaMedica(request).subscribe({
        next: (response1) => {
          this.loadingService.setLoading(false);
          console.log(response1);
          this.router.navigate(['/proximas-atenciones-page']);
        },
        error: (error: any) => {
          console.log(error);
          this.loadingService.setLoading(false);
        },
      });
    }

  }
  onSubmitTratamiento(){
    if (this.tratamientoForm.valid) {
      const tratamientoData = this.tratamientoForm.value;
      this.tratamientos.push(tratamientoData);
      this.dataSource.data = this.tratamientos;
      this.tratamientoForm.reset();
    }
  }
  
}
export default ConsultaMedicaPageComponent;