import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { LoadingPageService } from '@services/loading-page.service';
import { PersonalServiceService } from '@services/personal-service.service';
import { PreventService } from '@services/prevent.service';
import { UserDataService } from '@services/user-data.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { imagenExamenConsulta } from '@interfaces/personal-data-request.interface';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewerDialogComponent } from '../image-viewer-dialog/image-viewer-dialog.component';
import { ImagenPreview } from '@interfaces/services.interface';
import { SweetAlertService } from '@services/sweet-alert.service';

@Component({
  selector: 'app-carga-imagenes-examen',
  imports: [
    MatTableModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './carga-imagenes-examen.component.html',
  styleUrl: './carga-imagenes-examen.component.scss',
})
export class CargaImagenesExamenComponent implements OnInit {
  displayedColumns = ['imagen', 'nombre', 'tamano'];
  dataSource = new MatTableDataSource<ImagenPreview>();
  private ps = inject(PersonalServiceService);
  private insuredData = inject(UserDataService);
  private loadingService = inject(LoadingPageService);
  private sweetAlertService = inject(SweetAlertService);
  private router = inject(Router);
  private prevent = inject(PreventService);
  
  disabled = this.loadingService.submitButtonDisabled$;

  constructor(private dialog: MatDialog){

  }
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    const MAX_SIZE_KB = 50000; // 50 MB en KB

    if (!files) return;

    const allowedExtensions = ['jpg', 'jpeg', 'png'];
    const archivos = Array.from(files);
    const nuevasImagenes: ImagenPreview[] = [];

    archivos.forEach((archivo) => {
      const extension = archivo.name.split('.').pop()?.toLowerCase();

      if (!extension || !allowedExtensions.includes(extension)) {
        alert(`El archivo ${archivo.name} tiene una extensión no permitida.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        nuevasImagenes.push({
          url: e.target.result,
          nombre: archivo.name,
          tamanoKB: Math.round(archivo.size / 1024),
          archivo: archivo 
        });
        let sumaMb = 0;
        this.dataSource.data.forEach(element => {
          sumaMb += element.tamanoKB;
        });
        if(sumaMb > MAX_SIZE_KB){
             Swal.fire({
                  html: `<h1>Mensaje Sistema</h1>Ha superado el limite de tamaño de imagenes permitidas`,
                  icon: "warning",
                  showConfirmButton: true,
                  draggable:false,
                  allowOutsideClick:false,
                  customClass: { confirmButton: "btn btn-warning" },
                  buttonsStyling: true,
                }).then(() => {
                });
                
                return;
        }
        
        this.dataSource.data = [...this.dataSource.data, ...nuevasImagenes];
      };

      reader.readAsDataURL(archivo);
    });
  }
  obtenerImagenesConsulta() {
    this.loadingService.setLoading(true);
    this.ps
      .obtenerExamenesConsulta({id_agendamiento:this.insuredData.currentUser()?.idAgendamiento})
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
          
        },
        error: (error) => {
          this.loadingService.setLoading(false);
        },
      });
  }
  abrirImagen(imagenUrl: string){
    this.dialog.open(ImageViewerDialogComponent, {
      data: { url: imagenUrl },
      panelClass: 'custom-dialog',
      maxWidth: '90vw',
      disableClose: false 
    });
    
  }
  eliminarImagen(imagen: any): void {
    const index = this.dataSource.data.indexOf(imagen);
    if (index >= 0) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription(); 
    }
  }
  cargarImagenes(){
    this.loadingService.setLoading(true);
    const formData = new FormData();

    this.dataSource.data.forEach((img: any) => {
      formData.append('imagenes', img.archivo, img.nombre); 
    });
    this.ps.CargarImagenesExamenes(formData,Number(this.insuredData.currentUser()?.idAgendamiento)).subscribe({
      next: (response) => {
        this.loadingService.setLoading(false);
        this.insuredData.setAgendamientoInsuredUser("");
        this.sweetAlertService.showSweetAlert("cargaexamenes","exitoso");
      },
      error: (error) => {
        this.loadingService.setLoading(false);
      
      },
    });
  }
  volverMenu() {
    this.router.navigate(['/proximas-atenciones-page']);
  }
  ngOnInit(): void {
    this.prevent.preventBackButton();
    this.loadingService.setLoading(false);
    if (
      !this.insuredData.currentUser()?.idAgendamiento ||
      this.insuredData.currentPortal()?.type_page === 'Paciente'
    ) {
      this.router.navigate(['/historial-atenciones-page']);
    }
    this.obtenerImagenesConsulta();
  }
}
export default CargaImagenesExamenComponent;
