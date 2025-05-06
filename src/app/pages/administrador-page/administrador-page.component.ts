import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { horasAgendadasPorPaciente, horasAgendadasPorDoctor, usuariosResponse, profesionalesResponse } from '@interfaces/personal-data-request.interface';
import { AuthService } from '@services/auth.service';
import { LoadingPageService } from '@services/loading-page.service';
import { PersonalServiceService } from '@services/personal-service.service';
import { PreventService } from '@services/prevent.service';
import { UserDataService } from '@services/user-data.service';
import { UtilsService } from '@services/utils.service';
import { ModificarPerfilDialogComponent } from '../modificar-perfil-dialog/modificar-perfil-dialog.component';

@Component({
  selector: 'app-administrador-page',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatCardModule,CommonModule],
  templateUrl: './administrador-page.component.html',
  styleUrl: './administrador-page.component.scss'
})
export class AdministradorPageComponent {

  private readonly authService = inject(AuthService);
  private readonly ps = inject(PersonalServiceService);
  private readonly insuredData = inject(UserDataService);
  private readonly loadingService = inject(LoadingPageService);
  private readonly utilService = inject(UtilsService);
  
  private readonly router = inject(Router);
  private readonly prevent = inject(PreventService);
  disabled = this.loadingService.submitButtonDisabled$;
  displayedColumns: string[] = [
    'nombre',
    'tipo_usuario',
    'tipo_perfil',
    'fecha',
    'acciones',
    
  ];
  horasAgendadasPorPaciente: horasAgendadasPorPaciente[] = [];
  Usuarios: profesionalesResponse[] = [];
  dataSource = new MatTableDataSource<profesionalesResponse>(
    this.Usuarios
  );

  ngOnDestroy() {}
  constructor(private dialog: MatDialog) {
  }
  ngOnInit() {
    this.prevent.preventBackButton();
    if(this.insuredData.currentPortal()?.type_page === "Administrador"){
    this.obtenerUsuarios();
    }else{
      this.router.navigate(["/inicio"]);
    }
  }
  crearProfesional(){
    this.router.navigate(["/crear-profesional-page"]);
  }
  modificarPerfil(element:profesionalesResponse){
    element
    const dialogRef = this.dialog.open(ModificarPerfilDialogComponent, {
      width: '600px',
      height: '400px',
      disableClose: true,
      autoFocus:true,
      data: {
        id_perfil: element.id_perfil,
        rut: element.rut,
        dv: element.dv,
        id_paciente:element.id_paciente,
        id_profesional:element.id_profesional
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.perfil || result.rut)) {
        console.log('Perfil seleccionado:', result);

        this.loadingService.setLoading(true);
        this.ps.modificarPerfilUsuario({rut:result.rut, perfil:result.perfil}).subscribe({
          next: (response1) => {
            this.loadingService.setLoading(false);
            this.obtenerUsuarios();
          },
          error: (error: any) => {
            console.log(error);
            this.loadingService.setLoading(false);
          },
        });
      }
    });
  }
  eliminarUsuario(element:profesionalesResponse){
    this.loadingService.setLoading(true);
    this.ps.eliminarUsuario(element.rut+element.dv).subscribe({
      next: (response1) => {
        this.loadingService.setLoading(false);
        this.obtenerUsuarios();
      },
      error: (error: any) => {
        console.log(error);
        this.loadingService.setLoading(false);
      },
    });
  }
  obtenerUsuarios() {
    this.loadingService.setLoading(true);
    this.ps.obtenerUsuarios().subscribe({
      next: (response1) => {
        this.loadingService.setLoading(false);
        this.Usuarios = response1.pacientes.concat(response1.profesionales);
        this.dataSource.data = this.Usuarios;
        console.log(response1);
      },
      error: (error: any) => {
        console.log(error);
        this.loadingService.setLoading(false);
      },
    });
  }
  volverMenu(){
    this.authService.logout();
    this.router.navigate(["/inicio"]);
  }
  
}
export default AdministradorPageComponent;
