import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '@services/auth.service';
import { UserDataService } from '@services/user-data.service';
import { LoadingPageService } from '@services/loading-page.service';
import { PersistFormDataService } from '@services/persist-form-data.service';
import { PersonalServiceService } from '@services/personal-service.service';
import { ValidationsService } from '@services/validations-forms.service';
import { rutValidator } from '../../directives/rut-validator';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import {MatDatepicker, MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import * as rutHelpers from "rut-helpers";
import { OnlyNumbersDirective } from '../../directives/only-numbers.directive';
import { crearAgendamientoPaciente, modificarAgendamientoPaciente, PacienteRequest, respuestasPreguntas } from '@interfaces/services.interface';
import { alternativaPreguntasInicialesResponse, Doctor, horasAgendadasPorDoctor, horasAgendadasPorPaciente, preguntasInicialesResponse, profesionalesResponse } from '@interfaces/personal-data-request.interface';
import { SweetAlertService } from '@services/sweet-alert.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PreventService } from '@services/prevent.service';
import { MatIconModule } from '@angular/material/icon';
import { OnlyLettersDirective } from '../../directives/only-letters.directive';
import { OnlyLettersNumbersDirective } from '../../directives/only-letters-numbers.directive';
import { UtilsService } from '@services/utils.service';


@Component({
  selector: 'app-agendamiento-page',
  imports: [MatIconModule, MatTooltipModule, OnlyNumbersDirective,OnlyLettersDirective,OnlyLettersNumbersDirective,MatInputModule,MatButtonModule,MatSelectModule,MatOptionModule, ReactiveFormsModule, FormsModule, CommonModule,MatStepperModule,MatDatepickerModule,MatNativeDateModule ],
  templateUrl: './agendamiento-page.component.html',
  providers: [rutValidator],
  styleUrl: './agendamiento-page.component.scss'
})
export class AgendamientoPageComponent implements OnInit {
  isLinear = false;
  private fb = inject(FormBuilder);
  private formDataService = inject(PersistFormDataService);
  private validationService = inject(ValidationsService);
  private loadingService = inject(LoadingPageService);
  private readonly authSession = inject(UserDataService);
  private readonly authService = inject(AuthService);
  private readonly utilService = inject(UtilsService);
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
  PersonalDataForm: FormGroup;
  ContactDataForm: FormGroup;
  BirthdayDataForm: FormGroup;
  PersonalQuestionsForm: FormGroup;
  DoctorAgendamientoForm: FormGroup;
  doctors: Doctor[] = [];
  valueRut: string;
  preguntasIniciales: preguntasInicialesResponse[] = [];
  alternativaPreguntasIniciales: alternativaPreguntasInicialesResponse[] = [];
  profesionales: profesionalesResponse[] = [];
  horasAgendadasPorDia:horasAgendadasPorDoctor[];
  fechaSeleccionada: string;
  omitirPreguntas: boolean = false;
  activeDoctorId: string;
  minSelectableDate: Date;
  seleccionHora: boolean = false;
  editable: boolean = true;
  private prevent = inject(PreventService);
  disabledDates: Date[] = [];
  horasAgendadasPorPaciente: horasAgendadasPorPaciente[] = [];
  
  constructor(private cdr: ChangeDetectorRef) {
    this.PersonalDataForm = this.fb.group(
      {
        rut:  [null, [Validators.required, Validators.maxLength(12), Validators.minLength(7), this.rutValidate]],
        nombres: [null, [Validators.required,Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/),Validators.maxLength(80),Validators.minLength(1)]],
        apellidoPaterno: [null, [Validators.required,Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/),Validators.maxLength(80),Validators.minLength(1)]],
        apellidoMaterno: [null, [Validators.required,Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/),Validators.maxLength(80),Validators.minLength(1)]],
      },
    );
    this.ContactDataForm = this.fb.group(
      {
        correo: [null, [Validators.email, Validators.required, Validators.pattern('^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$'), Validators.minLength(1),Validators.maxLength(60)]],
        telefono: [null, [Validators.required, Validators.pattern(/^[0-9]\d*$/), Validators.maxLength(8), Validators.minLength(8)]],
        direccion: [null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ ]+$/), Validators.minLength(1),Validators.maxLength(40)]],
      
      },
    );
    this.BirthdayDataForm = this.fb.group(
      {
        day: [null, [Validators.required, Validators.pattern(/^(0[1-9]|[12][0-9]|3[01])$/), Validators.max(31),Validators.minLength(2), Validators.maxLength(2)]],
        month: [null, [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/), Validators.max(12),Validators.minLength(2), Validators.maxLength(2)]],
        year: [null, [Validators.required, Validators.pattern(/^\d{4}$/),Validators.minLength(4), Validators.min(1900), Validators.max(new Date().getFullYear()), Validators.maxLength(4)]],
      },
      { validators: this.validationService.validateDateAndAge() }
    );

    this.PersonalQuestionsForm = this.fb.group(
      {
        pregunta1:  [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        pregunta2: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        pregunta3: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        pregunta4: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        pregunta5: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      },
    );
    this.DoctorAgendamientoForm = this.fb.group(
      {
        appointmentDate: [null,Validators.required,],
      appointmentTime: [null,Validators.required,],
      },
    );
  }
  trackPreguntaInicial(index: number, preguntaInicial: any): string {
    return preguntaInicial.id_pregunta; 
  }
  getAlternativasParaPregunta(idPregunta: string) {
    return this.alternativaPreguntasIniciales.filter(a => a.id_pregunta === idPregunta.toString());
  }
  filterWeekends = (date: Date | null): boolean => {
    if (!date) return false;

  const day = date.getDay();
  const formattedDate = date.toISOString().split('T')[0];

  const isWeekend = (day === 0 || day === 6);

  const isDisabled = this.disabledDates.some((d) => {
    const disabledFormatted = d.toISOString().split('T')[0];
    const match = disabledFormatted === formattedDate;
    if (match) {
      console.log('Fecha filtrada por disabledDates:', formattedDate);
    }
    return match;
  });
  const fechaHastaStr = this.utilService.getFutureDate(); // ej: '15/06/2025'
  const [dayF, monthF, yearF] = fechaHastaStr.split('/');
  const fechaHasta = new Date(+yearF, +monthF - 1, +dayF); // Mes 0-indexed

  const isAfterLimit = date > fechaHasta;
  if (isAfterLimit) {
    console.log('Fecha fuera del rango permitido:', formattedDate);
  }
  return !isWeekend && !isDisabled && !isAfterLimit;
};

  onEmailnInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.ContactDataForm.controls['correo'].setValue(input.value.toUpperCase(), { emitEvent: false });
  }

  cargarAgendaDisponible(doctor: Doctor): void {
    this.ps.obtenerDiaSinDisponibilidadPorDoctor({ id_profesional: doctor.id }).subscribe({
      next: (response) => {
        this.disabledDates = [];
        if (response.length > 0) {
          this.disabledDates = response.map((obj) => new Date(obj.fecha));
  
          this.filterWeekends = (date: Date | null): boolean => {
            if (!date) return false;
  
            const day = date.getDay();
            const formattedDate = date.toISOString().split('T')[0];
  
            const isWeekend = (day === 0 || day === 6);
            const isDisabled = this.disabledDates.some(
              d => d.toISOString().split('T')[0] === formattedDate 
            );
  
              const fechaHastaStr = this.utilService.getFutureDate(); // ej: '15/06/2025'
          const [dayF, monthF, yearF] = fechaHastaStr.split('/');
          const fechaHasta = new Date(+yearF, +monthF - 1, +dayF); // Mes 0-indexed

        const isAfterLimit = date > fechaHasta;
          if (isAfterLimit) {
         console.log('Fecha fuera del rango permitido:', formattedDate);
          }
          return !isWeekend && !isDisabled && !isAfterLimit;
          };
  
        }else{
          
          this.filterWeekends = (date: Date | null): boolean => {
            if (!date) return false;
  
            const day = date.getDay();
            const isWeekend = (day === 0 || day === 6); 
  
              const fechaHastaStr = this.utilService.getFutureDate(); // ej: '15/06/2025'
          const [dayF, monthF, yearF] = fechaHastaStr.split('/');
          const fechaHasta = new Date(+yearF, +monthF - 1, +dayF); // Mes 0-indexed

        const isAfterLimit = date > fechaHasta;
          if (isAfterLimit) {
          }
          return !isWeekend  && !isAfterLimit;
          };
        }
      },
      error: (error: any) => {
        console.log(error);
        this.loadingService.setLoading(false);
      },
    });

  }
  obtenerAgendamientoPaciente() {
    this.ps.obtenerHorasAgendadasPorPaciente().subscribe({
      next: (response1) => {
        this.horasAgendadasPorPaciente = response1;
        if(this.horasAgendadasPorPaciente.length === 0){
          this.cargaDatosLogin();
        }else{
          this.loadingService.setLoading(false);
          this.sweetAlertService.showSweetAlert("horaAgendada", "existente");

        }
      },
      error: (error: any) => {
        console.log(error);
        this.loadingService.setLoading(false);
      },
    });
  }
  cargaDatosLogin(){
    this.ps.obtenerDatosPaciente().subscribe({
      next: (response) => {
        this.PersonalDataForm.patchValue({
          rut: response.rut+response.dv,
          nombres: response.nombres,
          apellidoPaterno: response.apellido_paterno,
          apellidoMaterno: response.apellido_materno,
        });
        this.ContactDataForm.patchValue({
          correo: response.correo,
          telefono: response.telefono,
          direccion: response.direccion,
        });
        const fecha = response.fecha_nacimiento.split("/");
        this.BirthdayDataForm.patchValue({
          day: fecha[0],
          month: fecha[1],
          year: fecha[2],
        });
        Object.keys(this.PersonalQuestionsForm.controls).forEach(controlName => {
          const control = this.PersonalQuestionsForm.get(controlName);
          control?.clearValidators();
          control?.updateValueAndValidity();
        });
        this.omitirPreguntas = true;
        
        setTimeout(() => {
          if (this.stepper) {
            this.stepper.selectedIndex = this.stepper._steps.length -1;
            this.obtenerProfesionales();
          }
        });
      },
      error: (error: any) => {
        console.log(error);
        this.loadingService.setLoading(false);
      },
    });
  }
  onSubmitDoctorAgendamientoData(doctor:Doctor,stepper:MatStepper):void{
    this.loadingService.setLoading(true);
      const form = doctor.form;
      if (form.valid && this.seleccionHora) {
        const date = form.get('appointmentDate')?.value;
        const hour = form.get('appointmentTime')?.value;
        const dateKey = date.toISOString().split('T')[0];
    
        if (!doctor.reservas[dateKey]) {
          doctor.reservas[dateKey] = [];
        }
    
        doctor.reservas[dateKey].push(hour);
        if(this.authSession.currentUser()?.idAgendamiento){
          const modificarAgendamientoRequest:modificarAgendamientoPaciente = {id_agendamiento:this.authSession.currentUser()?.idAgendamiento.toString()!,id_profesional: doctor.id, fecha: dateKey, hora: hour};
          this.ps.modificarAgendamientoPaciente(modificarAgendamientoRequest).subscribe({
            next: (response1) => {
              this.loadingService.setLoading(false);
              this.authSession.setAgendamientoInsuredUser("");
              this.sweetAlertService.showSweetAlert("modificacion", "exitoso");
            },
            error: (error: any) => {
              console.log(error);
              this.loadingService.setLoading(false);
            },
          });
        }else{
        const crearAgendamientoRequest:crearAgendamientoPaciente = {id_profesional: doctor.id, fecha: dateKey, hora: hour};
        this.ps.guardarAgendamientoPaciente(crearAgendamientoRequest).subscribe({
          next: (response1) => {
            this.loadingService.setLoading(false);
            this.sweetAlertService.showSweetAlert("agendamiento", "exitoso");

          },
          error: (error: any) => {
            console.log(error);
            this.loadingService.setLoading(false);
          },
        });
      }
      }
  }
  
  onSubmitPersonalQuestionsData(PersonalQuestionsForm:FormGroup,stepper:MatStepper):void{
    if (PersonalQuestionsForm.valid) {
      this.loadingService.setLoading(true);
      this.loadingService.setDisabledButton(true);
      this.formDataService.setForm("formPersonalQuestionsData", PersonalQuestionsForm);
      const respuestasPreguntas: respuestasPreguntas[] = [
        {id_pregunta: 1, respuesta: PersonalQuestionsForm.value.pregunta1},
        {id_pregunta: 2, respuesta: PersonalQuestionsForm.value.pregunta2},
        {id_pregunta: 3, respuesta: PersonalQuestionsForm.value.pregunta3},
        {id_pregunta: 4, respuesta: PersonalQuestionsForm.value.pregunta4},
        {id_pregunta: 5, respuesta: PersonalQuestionsForm.value.pregunta5},
      ];
      this.ps.guardarPreguntasIniciales(respuestasPreguntas).subscribe({
        next: (response1) => {
          this.ps.fetchXsrfToken().subscribe({
            next: (response1) => {
              stepper.next();
              this.obtenerProfesionales();
            },
            error: (error: any) => {
              console.log(error);
              this.loadingService.setLoading(false);
            },
          });
        },
        error: (error: any) => {
          console.log(error);
          this.loadingService.setLoading(false);
        },
      });
    }
  }

  onSubmitPersonalData(PersonalDataForm:FormGroup,stepper:MatStepper): void {
    if (PersonalDataForm.valid) {
      this.loadingService.setLoading(true);
      this.loadingService.setDisabledButton(true);
      this.formDataService.setForm("formPersonalData", PersonalDataForm);
      const rutWithoutDotCiv = PersonalDataForm.value.rut.replace(/\./g, "");
      const rutWithoutDot = PersonalDataForm.value.rut.replace(/\./g, "").replace("-", "");
      const loginRequest = {rut:rutWithoutDot};
      this.authService.withoutLoginPacientes(loginRequest).subscribe({
        next: (response1) => {
          if (!response1 || response1.auth === false) {
            this.loadingService.setLoading(false);
            if(response1.message === "Cree contraseña para continuar."){
            this.ps.fetchXsrfToken().subscribe({
            next: (response) => {
              this.authService.setXsrfToken(response.token);
              this.loadingService.setLoading(false);
            },
            error: (error: any) => {
              console.log(error);
              this.loadingService.setLoading(false);
            },
          });
            }
          }else{
          this.ps.fetchXsrfToken().subscribe({
            next: (response1) => {
              stepper.next(); 
              this.authService.setXsrfToken(response1.token);
              this.loadingService.setLoading(false);
            },
            error: (error: any) => {
              console.log(error);
              this.loadingService.setLoading(false);
            },
          });}
        },
        error: (error: any) => {
          console.log(error);
          this.loadingService.setLoading(false);
        },
      });
}
  }

  obtenerPaciente(){
    
  }
setFormatRut(value: Event) {
  this.valueRut = rutHelpers.rutFormat((value.target as HTMLInputElement).value);
  this.PersonalDataForm.controls["rut"].setValue(this.valueRut);
}
onSubmitContactData(ContactDataForm:FormGroup,stepper:MatStepper): void {
  if (ContactDataForm.valid) {
    this.loadingService.setLoading(false);
    this.loadingService.setDisabledButton(true);
    stepper.next();
    this.formDataService.setForm("formContactData", ContactDataForm);
}
}

fullDateReturn() {
  const day = this.formDataService.getForm("formBirthdayData")!.value.day;
  const month = this.formDataService.getForm("formBirthdayData")!.value.month;
  const year = this.formDataService.getForm("formBirthdayData")!.value.year;
  const fullDate = day + "/" + month + "/" + year;
  return fullDate;
}
onSubmitBirthdayData(BirthdayDataForm:FormGroup,stepper:MatStepper): void {
  if (BirthdayDataForm.valid) {
    this.formDataService.setForm("formBirthdayData", BirthdayDataForm);
    this.loadingService.setLoading(true);
    this.loadingService.setDisabledButton(true);
    const crearPacienteRequest:PacienteRequest = {rut:this.PersonalDataForm.value.rut.replace(/\./g, "").replace("-", ""),dv:"", nombres:this.PersonalDataForm.value.nombres.toUpperCase(), apellido_paterno:this.PersonalDataForm.value.apellidoPaterno.toUpperCase(), apellido_materno:this.PersonalDataForm.value.apellidoMaterno.toUpperCase(), correo:this.ContactDataForm.value.correo.toUpperCase(), telefono:this.ContactDataForm.value.telefono, direccion:this.ContactDataForm.value.direccion, fecha_nacimiento:this.fullDateReturn()};
    this.authService.crearPaciente(crearPacienteRequest).subscribe({
      next: (response1) => {
        this.authSession.setCreatePacienteInsuredUser();
        this.getPreguntasIniciales();
        stepper.next(); 
        
      },
      error: (error: any) => {
        console.log(error);
        this.loadingService.setLoading(false);
      },
    });
    
  }
}
ngOnInit(): void {
  this.prevent.preventBackButton();
  this.authSession.currentUser()?.token && this.authSession.currentPortal()?.type_page === "Paciente" ? this.preLoadData() : this.loadingService.setLoading(false);
  this.minSelectableDate = this.getMinDateWithTimeRestriction();
}
preLoadData(){
  this.editable = false;
  this.loadingService.setLoading(true);
  if(this.authSession.currentUser()?.idAgendamiento){
    this.cargaDatosLogin();
  }else{
    this.obtenerAgendamientoPaciente();
  }
 
}
createAgendaProfesionales(){
  this.doctors = this.profesionales.map((profesional) => ({
    id: profesional.id_profesional,
    nombre_completo: profesional.nombres + " " + profesional.apellido_paterno + " " + profesional.apellido_materno,
    rut: profesional.rut + "-" + profesional.dv,
    especialidad: profesional.especialidad,
    puntaje: Number(profesional.puntaje),
    form: this.fb.group(
      {
        appointmentDate: [null,Validators.required,],
      appointmentTime: [null,Validators.required,]}),
    horasDisponibles: [],
    reservas: {},
  }));

  this.loadingService.setLoading(false);
}
today: Date = new Date();
onDateChange(event: MatDatepickerInputEvent<Date>,doctor:Doctor) {
  this.activeDoctorId = doctor.id;

  this.doctors.forEach(doctorr => {
    if (doctorr.id !== doctor.id) {
      doctorr.form.reset(); 
      doctorr.horasDisponibles = []; 
    }
  });

  const fechaSeleccionada = event.value;
  const dia = fechaSeleccionada!.getDate(); 
  const mes = fechaSeleccionada!.getMonth() + 1; 
  const anio = fechaSeleccionada!.getFullYear();
  const fechaParseada = dia.toString().padStart(2, '0')+"/"+mes.toString().padStart(2, '0')+"/"+anio;
  this.fechaSeleccionada = fechaParseada;
  this.generateHalfHourSlots(doctor,fechaParseada);
  this.seleccionHora = false;
}
getMinDateWithTimeRestriction(): Date {
  const now = new Date();
  
  const cutoffTime = 18; 

  if (now.getHours() >= cutoffTime) {
    now.setDate(now.getDate() + 1); 
    now.setHours(0, 0, 0, 0);  
  } else {
    now.setHours(0, 0, 0, 0); 
  }

  return now;
}
getPreguntasIniciales(){
  this.ps.obtenerPreguntasIniciales().subscribe({
    next: (response1) => {
      this.preguntasIniciales = response1;
      this.ps.obtenerAlternativaPreguntasIniciales().subscribe({
        next: (response2) => {
          this.preguntasIniciales = response1;
          this.alternativaPreguntasIniciales = response2;
          this.loadingService.setLoading(false);
        },
        error: (error: any) => {
          console.log(error);
          this.loadingService.setLoading(false);
        },
      });
      this.loadingService.setLoading(false);
    },
    error: (error: any) => {
      console.log(error);
      this.loadingService.setLoading(false);
    },
  });
}
obtenerProfesionales(){
  this.loadingService.setLoading(true);
  this.ps.obtenerRecomendacionesProfesionales().subscribe({
    next: (response) => {
      this.profesionales = response;
      this.createAgendaProfesionales();
      
    },
    error: (error: any) => {
      console.log(error);
      this.loadingService.setLoading(false);
    },
  });
}

generateHalfHourSlots(doctor: Doctor,fecha:string) {
  this.loadingService.setLoading(true);
this.loadingService.setDisabledButton(true);

const request = { id_profesional: doctor.id, fechaDesde: fecha, fechaHasta: fecha };

this.ps.obtenerHorasAgendadasPorDoctor(request).subscribe({
  next: (response) => {
    this.horasAgendadasPorDia = response;
    doctor.horasDisponibles = [];

    const startHour = 9;
    const endHour = 18;

    const hoy = new Date();
    const fechaSeleccionada = this.parseFechaString(fecha);
    const esHoy = hoy.toDateString() === fechaSeleccionada.toDateString();

    for (let hour = startHour; hour <= endHour; hour++) {
      const hora00 = this.formatHour(hour, 0);
      const yaAgendada00 = this.horasAgendadasPorDia.some(h => h.hora === hora00);

      if (!yaAgendada00 && (!esHoy || this.isFutureHour(hour, 0))) {
        doctor.horasDisponibles.push(hora00);
      }

      if (hour < endHour) {
        const hora30 = this.formatHour(hour, 30);
        const yaAgendada30 = this.horasAgendadasPorDia.some(h => h.hora === hora30);

        if (!yaAgendada30 && (!esHoy || this.isFutureHour(hour, 30))) {
          doctor.horasDisponibles.push(hora30);
        }
      }
    }

    this.loadingService.setLoading(false);
  },
  error: (error: any) => {
    console.log(error);
    this.loadingService.setLoading(false);
  },
});

  
}
private parseFechaString(fecha: string): Date {
  const [day, month, year] = fecha.split("/").map(Number);
  return new Date(year, month - 1, day);
}
private isFutureHour(hour: number, minutes: number): boolean {
  const now = new Date();
  const future = new Date();

  future.setHours(hour, minutes, 0, 0);

  const nowConMargen = new Date(now.getTime());

  return future > nowConMargen;
}
volverInicio(){
  this.router.navigate(['/inicio']);
}
formatHour(hour: number, minute: number): string {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

selectHour(doctor: Doctor, hour: string) {
  doctor.form.get('appointmentTime')?.setValue(hour);
  this.seleccionHora = true;
}
trackByDoctorId(index: number, doctor: Doctor): number {
  return Number(doctor.id);
}
}
export default AgendamientoPageComponent;
