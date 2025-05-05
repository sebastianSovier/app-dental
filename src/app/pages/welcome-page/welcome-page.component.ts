import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import {  FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { PersonalServiceService } from "@services/personal-service.service";
import { LoadingPageService } from "@services/loading-page.service";
import { PreventService } from "@services/prevent.service";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { profesionalesPuntuacion } from "@interfaces/personal-data-request.interface";
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: "app-welcome-page",
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule,MatProgressBarModule, MatCheckboxModule, ReactiveFormsModule, FormsModule, CommonModule,MatCardModule, MatButtonModule],
  templateUrl: "./welcome-page.component.html",
  styleUrl: "./welcome-page.component.scss",
})
export class WelcomePageComponent implements OnInit, OnDestroy {
  private ps = inject(PersonalServiceService);
  private loadingService = inject(LoadingPageService);

  private router = inject(Router);
  private prevent = inject(PreventService);
  disabled = this.loadingService.submitButtonDisabled$;
  profesionalesPuntaje:profesionalesPuntuacion[] = [];

  ngOnDestroy() {}
  constructor() {

  }
  ngOnInit() {
    this.prevent.preventBackButton();
    this.obtenerProfesionalesPuntaje();
  }
  getNumber(value:string){
    return Number(value) * 10;
  }
  obtenerProfesionalesPuntaje(){
    this.loadingService.setLoading(true);
    this.ps.obtenerProfesionalesPuntuacion().subscribe({
      next: (response) => {
  
        this.profesionalesPuntaje = response;
        this.loadingService.setLoading(false);
      },
      error: (err) => {
        this.loadingService.setLoading(false);
        console.log(err);
      },
    });
  }

  goToAgendamiento(){
    this.router.navigate(["/agendamiento-page"]);
  }
}

export default WelcomePageComponent;
