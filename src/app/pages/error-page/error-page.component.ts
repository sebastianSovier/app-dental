import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { AuthService } from "@services/auth.service";
import { PersistFormDataService } from "@services/persist-form-data.service";
import { LoadingPageService } from "@services/loading-page.service";
import { PreventService } from "@services/prevent.service";
import { PersonalServiceService } from "@services/personal-service.service";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "app-error-page",
  standalone: true,
  imports: [ MatIconModule, MatButtonModule,MatCardModule],
  templateUrl: "./error-page.component.html",
  styleUrls: ["./error-page.component.scss"], // Corrección aquí
})
export class ErrorPageComponent implements OnInit {
  private formService = inject(PersistFormDataService);
  private router = inject(Router);
  private auth = inject(AuthService);
  private loadingService = inject(LoadingPageService);
  private prevent = inject(PreventService);
  private ps = inject(PersonalServiceService);
  constructor() {
  }

  ngOnInit(): void {
    this.prevent.preventBackButton();
    this.formService.clearForms();
  }
  exit(){
    this.prevent.preventBackButton();
    this.formService.clearForms();
    this.auth.logout();
    //this.authService.resetData();
    this.loadingService.setLoading(false);
    this.router.navigate(["/inicio"]);
  }
  
  
}
