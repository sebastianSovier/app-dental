
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { imagenExamenConsulta } from '@interfaces/personal-data-request.interface';
import { LoadingPageService } from '@services/loading-page.service';
import { PersonalServiceService } from '@services/personal-service.service';
import { PreventService } from '@services/prevent.service';
import { UserDataService } from '@services/user-data.service';
import { ImageViewerDialogComponent } from '../image-viewer-dialog/image-viewer-dialog.component';
import { ImagenPreview } from '@interfaces/services.interface';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-visualizar-examenes-paciente',
  imports: [
    MatTableModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule
],
  templateUrl: './visualizar-examenes-paciente.component.html',
  styleUrl: './visualizar-examenes-paciente.component.scss'
})
export class VisualizarExamenesPacienteComponent {
  displayedColumns = ['imagen', 'nombre','acciones'];
  dataSource = new MatTableDataSource<ImagenPreview>();
  private ps = inject(PersonalServiceService);
  private insuredData = inject(UserDataService);
  private loadingService = inject(LoadingPageService);

  private router = inject(Router);
  private prevent = inject(PreventService);
  
  disabled = this.loadingService.submitButtonDisabled$;

  constructor(private dialog: MatDialog){

  }

  obtenerImagenesConsulta() {
    this.loadingService.setLoading(true);
    this.ps
      .obtenerExamenesConsultaPaciente({id_agendamiento:this.insuredData.currentUser()?.idAgendamiento.toString()})
      .subscribe({
        next: (response) => {
          this.loadingService.setLoading(false);
          if (response.length > 0) {
            const imagenes: ImagenPreview[] = response.map((img: imagenExamenConsulta) => ({
              url: img.imagen_examen,
              nombre: img.nombre_examen,
              tamanoKB:  Math.round(Number(img.tamano)),
              archivo: null
            }));
            this.dataSource.data = imagenes;
            this.loadingService.setLoading(false);
          }
          this.insuredData.setAgendamientoInsuredUser("");
        },
        error: (error) => {
          this.loadingService.setLoading(false);
        },
      });
  }
  getNombreArchivo(url: string): string {
    return url.split('/').pop() || 'imagen.png';
  }
  abrirImagen(imagenUrl: string){
    this.dialog.open(ImageViewerDialogComponent, {
      data: { url: imagenUrl },
      panelClass: 'custom-dialog',
      maxWidth: '90vw',
      disableClose: false
    });
    
  }
  descargarImagen(imagen: any): void {
    const index = this.dataSource.data.indexOf(imagen);
    if (index >= 0) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription(); 
    }
  }
  volverMenu() {
    this.router.navigate(['/historial-atenciones-page']);
  }
  ngOnInit(): void {
    this.prevent.preventBackButton();
    this.loadingService.setLoading(false);
    if (
      !this.insuredData.currentUser()?.idAgendamiento ||
      this.insuredData.currentPortal()?.type_page === 'Profesional'
    ) {
      this.router.navigate(['/historial-atenciones-page']);
    }
    this.obtenerImagenesConsulta();
  }
}
export default VisualizarExamenesPacienteComponent;
