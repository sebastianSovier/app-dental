import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ImageViewerDialogComponent } from '../image-viewer-dialog/image-viewer-dialog.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LoadingPageService } from '@services/loading-page.service';
import { PersonalServiceService } from '@services/personal-service.service';
import { profesionalesResponse } from '@interfaces/personal-data-request.interface';
import { UserDataService } from '@services/user-data.service';
import { PreventService } from '@services/prevent.service';
import { Router } from '@angular/router';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ValidationsService } from '@services/validations-forms.service';

@Component({
  selector: 'app-derivar-paciente-dialog',
  imports: [MatSelectModule,MatFormFieldModule,CommonModule,MatDialogModule,MatButtonModule],
  templateUrl: './derivar-paciente-dialog.component.html',
  styleUrl: './derivar-paciente-dialog.component.scss'
})
export class DerivarPacienteDialogComponent {
  private ps = inject(PersonalServiceService);
  private validationService = inject(ValidationsService);

  private loadingService = inject(LoadingPageService);
  profesionales: profesionalesResponse[] = [];
  isValidInput = (fieldName: string | number, form: FormGroup) => this.validationService.isValidInput(fieldName, form);
  errorMessages: Record<string, string> = this.validationService.errorMessages;
  errors = (control: AbstractControl | null) => this.validationService.errors(control);
   private readonly authSession = inject(UserDataService);
    private readonly insuredData = inject(UserDataService);
    private readonly router = inject(Router);
    private readonly prevent = inject(PreventService);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id_perfil: string,rut:string,id_paciente:string,id_profesional:string },
    private dialogRef: MatDialogRef<ImageViewerDialogComponent>
  ) {}

profesionalSeleccionado: string = ''; 
profesional:profesionalesResponse;
  ngOnInit() {
    this.prevent.preventBackButton();
    if(this.insuredData.currentPortal()?.type_page !== "Profesional" || !this.authSession.currentUser()?.idAgendamiento){
      this.router.navigate(["/inicio"]);
      }else{
        this.obtenerProfesionales();
      }
  }
  obtenerProfesionales(){
    this.loadingService.setLoading(true);    
    this.ps.obtenerProfesionales().subscribe({
      next: (response) => {
        this.profesionales = response;
        this.profesional = this.profesionales.find((profesional) => profesional.id_profesional === this.data.id_profesional) || this.profesionales[0];
        this.profesionales = this.profesionales.filter((profesional) => { return profesional.id_profesional !== this.data.id_profesional});
        this.profesionalSeleccionado = this.profesional.id_profesional;
        this.loadingService.setLoading(false);       
        //this.profesionalSeleccionado = this.data.id_profesional;
       
      },
      error: (error: any) => {
        console.log(error);
        this.loadingService.setLoading(false);
      },
    });
  }
  cerrar(): void {
    this.dialogRef.close();
  }
  OnProfesionalChange() {
    if(this.profesionalSeleccionado !== this.data.id_profesional )
    this.loadingService.setLoading(true);    
    this.dialogRef.close({profesional:this.profesionalSeleccionado});
  }
}
