import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {  Router } from '@angular/router';
import { UserDataService } from '@services/user-data.service';
import { LoadingPageService } from '@services/loading-page.service';
import { PersonalServiceService } from '@services/personal-service.service';
import { PreventService } from '@services/prevent.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { eliminarCitaPaciente, horasAgendadasPorDoctor, horasAgendadasPorPaciente } from '@interfaces/personal-data-request.interface';
import { UtilsService } from '@services/utils.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proximas-atenciones-page',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatCardModule,CommonModule],
  templateUrl: './proximas-atenciones-page.component.html',
  styleUrl: './proximas-atenciones-page.component.scss',
})
export class ProximasAtencionesPageComponent {
  private ps = inject(PersonalServiceService);
  private insuredData = inject(UserDataService);
  private loadingService = inject(LoadingPageService);
  private utilService = inject(UtilsService);
  
  private router = inject(Router);
  private prevent = inject(PreventService);
  disabled = this.loadingService.submitButtonDisabled$;
  displayedColumns: string[] = [
    'nombre_doctor',
    'especialidad',
    'fecha',
    'hora',
    'estado',
    'acciones',
  ];
  displayedColumnsPaciente: string[] = [
    'nombre_paciente',
    'fecha',
    'hora',
    'estado',
    'acciones',
  ];
  horasAgendadasPorPaciente: horasAgendadasPorPaciente[] = [];

  dataSource = new MatTableDataSource<horasAgendadasPorPaciente>(
    this.horasAgendadasPorPaciente
  );
  apiUrl: any;
  horasAgendadasPorDoctor: horasAgendadasPorDoctor[] = [];
  dataSourceDoctor = new MatTableDataSource<horasAgendadasPorDoctor>(
    this.horasAgendadasPorDoctor
  );

  ngOnDestroy() {}
  constructor() {
  }
  ngOnInit() {
    this.prevent.preventBackButton();
    if(this.insuredData.currentPortal()?.type_page === "Paciente"){
    this.obtenerAgendamientoPaciente();
    }else{
      this.obtenerAgendamientoDoctor();
    }
  }

  obtenerAgendamientoPaciente() {
    this.loadingService.setLoading(true);
    this.ps.obtenerHorasAgendadasPorPaciente().subscribe({
      next: (response1) => {
        this.loadingService.setLoading(false);
        this.horasAgendadasPorPaciente = response1;
        this.dataSource.data = this.horasAgendadasPorPaciente;
        console.log(response1);
      },
      error: (error: any) => {
        console.log(error);
        this.loadingService.setLoading(false);
      },
    });
  }
  obtenerAgendamientoDoctor() {
    this.loadingService.setLoading(true);
   
    const request = {id_profesional:"", fechaDesde:this.utilService.getActualDate(),fechaHasta:this.utilService.getFutureDate()};
    this.ps.obtenerHorasAgendadasPorDoctor(request).subscribe({
      next: (response1) => {
        this.loadingService.setLoading(false);
        this.horasAgendadasPorDoctor = response1;
        this.dataSourceDoctor.data = this.horasAgendadasPorDoctor;
        console.log(response1);
      },
      error: (error: any) => {
        console.log(error);
        this.loadingService.setLoading(false);
      },
    });
  }
  modificarCita(element:horasAgendadasPorPaciente){
    this.loadingService.setLoading(true);
    this.insuredData.setAgendamientoInsuredUser(element.id_agendamiento.toString());
    this.router.navigate([
      '/agendamiento-page'
    ]);
  }
  cargarExamenesMedicos(item:horasAgendadasPorDoctor) {
    this.loadingService.setLoading(true);
    this.insuredData.setAgendamientoInsuredUser(item.id_agendamiento);
    this.router.navigate(["/carga-examenes-page"]);
   }
isHoraCercana(hora:string): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const [targetHour, targetMinute] = hora.split(':').map(num => parseInt(num, 10));

  const timeDifference = Math.abs((currentHour - targetHour) * 60 + (currentMinute - targetMinute));

  const timeThreshold = 20;  

  return timeDifference <= timeThreshold;
}
  ingresarConsulta(element:horasAgendadasPorDoctor){
    this.loadingService.setLoading(true);
    this.insuredData.setAgendamientoInsuredUser(element.id_agendamiento);
    this.router.navigate([
      '/consulta-medica-page'
    ]);
  }
  eliminarCita(element:horasAgendadasPorPaciente | horasAgendadasPorDoctor){
    Swal.fire({
      html: `<h1>Eliminación</h1>¿Esta seguro que desea eliminar el registro?`,
      icon: "warning",
      showConfirmButton: true,
      draggable:false,
      allowOutsideClick:false,
      showCancelButton: true,
      customClass: { confirmButton: "btn btn-warning" },
      buttonsStyling: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.loadingService.setLoading(true);
        const eliminarCita :eliminarCitaPaciente = {id_agendamiento: element.id_agendamiento.toString()};
        this.ps.eliminarAgendamientoPaciente(eliminarCita).subscribe({
          next: (response1) => {
            this.obtenerAgendamientoPaciente();
            console.log(response1);
          },
          error: (error: any) => {
            console.log(error);
            this.loadingService.setLoading(false);
          },
        });
      }
    });
      
   

  }
  confirmarCita(element:horasAgendadasPorPaciente){
    this.loadingService.setLoading(true);
    const eliminarCita :eliminarCitaPaciente = {id_agendamiento: element.id_agendamiento.toString()};
    this.ps.confirmarAgendamientoPaciente(eliminarCita).subscribe({
      next: (response1) => {
        this.obtenerAgendamientoPaciente();
        console.log(response1);
      },
      error: (error: any) => {
        console.log(error);
        this.loadingService.setLoading(false);
      },
    });
  }
  volverMenu() {
    if(this.insuredData.currentPortal()?.type_page === "Paciente"){
      this.router.navigate(['/personal-menu-page']);
    }else{
      this.router.navigate(['/inicio']);

    }
  }
  recargarTabla(){
    this.ngOnInit();
  }
  

}
export default ProximasAtencionesPageComponent;