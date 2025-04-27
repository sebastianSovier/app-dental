import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { horasAgendadasPorPaciente, horasAgendadasPorDoctor } from '@interfaces/personal-data-request.interface';
import { LoadingPageService } from '@services/loading-page.service';
import { PersonalServiceService } from '@services/personal-service.service';
import { PreventService } from '@services/prevent.service';
import { UserDataService } from '@services/user-data.service';
import { UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-historial-atenciones-page',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatCardModule,CommonModule],
  templateUrl: './historial-atenciones-page.component.html',
  styleUrl: './historial-atenciones-page.component.scss'
})
export class HistorialAtencionesPageComponent {
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
  constructor(private route: ActivatedRoute) {
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
    this.ps.obtenerHistoricoHorasAgendadasPorPaciente().subscribe({
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
  volverMenu(){
    this.router.navigate(["/personal-menu-page"]);
  }
  obtenerAgendamientoDoctor() {
    this.loadingService.setLoading(true);
   
    const request = {id_profesional:"", fechaDesde:this.utilService.getBeforeDate(),fechaHasta:this.utilService.getBeforeDatDate()};
    this.ps.obtenerHistoricoHorasAgendadasPorDoctor(request).subscribe({
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
  evaluarAtencion(item:horasAgendadasPorPaciente){
    
    this.loadingService.setLoading(true);
    this.insuredData.setAgendamientoInsuredUser(item.id_agendamiento);
    this.router.navigate(["/evaluar-atencion-page"]);
  }

  cargarExamenesMedicos(item:horasAgendadasPorDoctor) {
      this.loadingService.setLoading(true);
      this.insuredData.setAgendamientoInsuredUser(item.id_agendamiento);
      this.router.navigate(["/carga-examenes-page"]);
      /*const request = {id_agendamiento:item.id_agendamiento};
      this.ps.descargarExamenesMedicos(request).subscribe({
        next: (response1) => {
          this.loadingService.setLoading(false);
          console.log(response1);
        },
        error: (error: any) => {
          console.log(error);
          this.loadingService.setLoading(false);
        },
      });
    }
  */}
  descargarExamenesMedicos(item:horasAgendadasPorPaciente){
    this.loadingService.setLoading(true);
    this.insuredData.setAgendamientoInsuredUser(item.id_agendamiento);
    this.router.navigate(["/visualizar-examenes-page"]);
  }

}

export default HistorialAtencionesPageComponent;