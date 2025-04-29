import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { horasAgendadasPorPaciente, horasAgendadasPorDoctor, obtenerTratamientoConsultaPaciente } from '@interfaces/personal-data-request.interface';
import { LoadingPageService } from '@services/loading-page.service';
import { PersonalServiceService } from '@services/personal-service.service';
import { PreventService } from '@services/prevent.service';
import { UserDataService } from '@services/user-data.service';
import { UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-tratamientos-consulta-paciente',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatCardModule,CommonModule],
  templateUrl: './tratamientos-consulta-paciente.component.html',
  styleUrl: './tratamientos-consulta-paciente.component.scss'
})
export class TratamientosConsultaPacienteComponent implements OnInit {
  private ps = inject(PersonalServiceService);
  private insuredData = inject(UserDataService);
  private loadingService = inject(LoadingPageService);
  private utilService = inject(UtilsService);
  
  private router = inject(Router);
  private prevent = inject(PreventService);
  disabled = this.loadingService.submitButtonDisabled$;

  displayedColumnsPaciente: string[] = [
    'nombre_tratamiento',
    'descripcion',
    'valor',
    
  ];
  tratamientoConsultaPaciente: obtenerTratamientoConsultaPaciente[] = [];

  dataSource = new MatTableDataSource<obtenerTratamientoConsultaPaciente>(
    this.tratamientoConsultaPaciente
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
    this.loadingService.setLoading(false);
    this.prevent.preventBackButton();
    if(!this.insuredData.currentUser()?.idAgendamiento){
      this.router.navigate(['/proximas-atenciones-page']);
    }
    
    this.obtenerTratamientosConsulta();
  }
  obtenerTratamientosConsulta() {
    this.loadingService.setLoading(true);
    this.ps
      .obtenerTratamientoConsultaPaciente({id_agendamiento:this.insuredData.currentUser()?.idAgendamiento.toString()})
      .subscribe({
        next: (res) => {
          this.tratamientoConsultaPaciente = res;
          this.dataSource = new MatTableDataSource<obtenerTratamientoConsultaPaciente>(
            this.tratamientoConsultaPaciente
          );
          this.loadingService.setLoading(false);
        },
        error: (err) => {
          this.loadingService.setLoading(false);
        },
      });
}
volverMenu(){
  this.loadingService.setLoading(true);
  this.router.navigate(["/historial-atenciones-page"]);
}

}
export default TratamientosConsultaPacienteComponent;
