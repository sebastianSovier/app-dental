import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, AbstractControl, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { Router } from '@angular/router';
import { guardarPuntuacionAtencionPaciente } from '@interfaces/services.interface';
import { LoadingPageService } from '@services/loading-page.service';
import { PersonalServiceService } from '@services/personal-service.service';
import { PreventService } from '@services/prevent.service';
import { SweetAlertService } from '@services/sweet-alert.service';
import { UserDataService } from '@services/user-data.service';
import { ValidationsService } from '@services/validations-forms.service';
import { MatDatepickerModule  } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UtilsService } from '@services/utils.service';
@Component({
  selector: 'app-gestion-agenda-profesional-page',
  imports: [ReactiveFormsModule,CommonModule,MatFormFieldModule, MatCardModule,MatInputModule,MatSliderModule,MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './gestion-agenda-profesional-page.component.html',
  styleUrl: './gestion-agenda-profesional-page.component.scss'
})
export class GestionAgendaProfesionalPageComponent implements OnInit {
  ratingForm: FormGroup;
  private fb = inject(FormBuilder);
  private validationService = inject(ValidationsService);
  private loadingService = inject(LoadingPageService);
  private readonly authSession = inject(UserDataService);
  private readonly router = inject(Router);
  private readonly utilService = inject(UtilsService);
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
  disabledDates: Date[] = [];
 
  getFormControl(name: string): FormControl {
    return this.ratingForm.get(name) as FormControl;
  }
  
  ngOnInit():void {
    this.prevent.preventBackButton();
    this.loadingService.setLoading(false);
    if(this.authSession.currentPortal()?.type_page !== "Profesional"){
      this.router.navigate(['/inicio']);
    }
    this.disabledDates = [];
    this.cargarAgendaDisponible();

  }
  get dateRangeGroup(): FormGroup {
    return this.formModificarDisponibilidad.get('dateRange') as FormGroup;
  }
  formModificarDisponibilidad: FormGroup;

  constructor() {
    this.formModificarDisponibilidad = this.fb.group({
      dateRange: this.fb.group({
        start: [null,Validators.required],
        end: [null,Validators.required]
      })
    });
  }
  today = new Date();

dateFilter = (date: Date | null): boolean => {
  if (!date) return false;

  const day = date.getDay();
  const tomorrow = new Date(this.today);
  tomorrow.setDate(this.today.getDate());
    const fechaHastaStr = this.utilService.getFutureDate();
          const [dayF, monthF, yearF] = fechaHastaStr.split('/');
          const fechaHasta = new Date(+yearF, +monthF - 1, +dayF);

        const isAfterLimit = date > fechaHasta;

  return day !== 0 && day !== 6 && date >= tomorrow && !isAfterLimit;
};

  cargarAgendaDisponible(): void {
    this.ps.obtenerDiaSinDisponibilidadPorDoctor({ id_profesional: "" }).subscribe({
      next: (response) => {
        this.loadingService.setLoading(false);
        this.disabledDates = [];
        if (response.length > 0) {
          this.disabledDates = response.map((obj) => new Date(obj.fecha));
  
          this.dateFilter = (date: Date | null): boolean => {
            if (!date) return false;
  
            const day = date.getDay();
            const formattedDate = date.toISOString().split('T')[0];
  
            const isWeekend = (day === 0 || day === 6);
            const isDisabled = this.disabledDates.some(
              d => d.toISOString().split('T')[0] === formattedDate 
            );
            const tomorrow = new Date(this.today);
            tomorrow.setDate(this.today.getDate());
          const fechaHastaStr = this.utilService.getFutureDate();
          const [dayF, monthF, yearF] = fechaHastaStr.split('/');
          const fechaHasta = new Date(+yearF, +monthF - 1, +dayF);

        const isAfterLimit = date > fechaHasta;
            return !isWeekend && !isDisabled && date >= tomorrow && !isAfterLimit;
          };
  
        }else{
          this.loadingService.setLoading(false);
          this.dateFilter = (date: Date | null): boolean => {
            if (!date) return false;
  
            const day = date.getDay();
            const isWeekend = (day === 0 || day === 6); 
            const tomorrow = new Date(this.today);
            tomorrow.setDate(this.today.getDate());
             const fechaHastaStr = this.utilService.getFutureDate();
          const [dayF, monthF, yearF] = fechaHastaStr.split('/');
          const fechaHasta = new Date(+yearF, +monthF - 1, +dayF);

        const isAfterLimit = date > fechaHasta;
            return !isWeekend && date >= tomorrow && !isAfterLimit;
          };
        }
      },
      error: (error: any) => {
        console.log(error);
        this.loadingService.setLoading(false);
      },
    });

  }
  onSubmit() {
    if(this.formModificarDisponibilidad.valid) {
      this.loadingService.setLoading(true);
    const { start, end } = this.formModificarDisponibilidad.value.dateRange;
    if (start && end) {
      const diaStart = start!.getDate(); 
      const mesStart = start!.getMonth() + 1; 
      const anioStart = start!.getFullYear();
      const fechaStart = diaStart.toString().padStart(2, '0')+"/"+mesStart.toString().padStart(2, '0')+"/"+anioStart;
      const diaEnd = end!.getDate(); 
      const mesEnd = end!.getMonth() + 1; 
      const anioEnd = end!.getFullYear();
      const fechaEnd = diaEnd.toString().padStart(2, '0')+"/"+mesEnd.toString().padStart(2, '0')+"/"+anioEnd;

      this.ps.modificarDisponibilidadDoctor({
        fechaDesde: fechaStart,
        fechaHasta: fechaEnd}).subscribe({
          next: (response1) => {
            this.loadingService.setLoading(false);
            this.sweetAlertService.showSweetAlert("agendamiento", "modificarDisponibilidad");
            console.log(response1);
          },
          error: (error: any) => {
            console.log(error);
            this.loadingService.setLoading(false);
          },
        });
    } 
  }
  }
  
  volverMenu(){
    this.router.navigate(["/personal-menu-page"]);
  }
  volverHistorial(){
    this.loadingService.setLoading(true);
    this.router.navigate(["/historial-atenciones-page"]);
  }

  
}
export default GestionAgendaProfesionalPageComponent;