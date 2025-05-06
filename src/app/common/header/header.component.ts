import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import {
  Component,
  HostListener,
  inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserDataService } from '@services/user-data.service';
import { AuthService } from '@services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingPageService } from '@services/loading-page.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatButtonModule,
    
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  public insuredData = inject(UserDataService);
  private loadingService = inject(LoadingPageService);
  constructor(
    public router: Router
  ) {}

  ngOnInit(): void {}

  goToLoginProfesional() {
    this.loadingService.setLoading(true);
    this.router.navigate(['/login-professional-page']);
  }
  goToMenu() {
    this.loadingService.setLoading(true);
    console.log(this.insuredData.currentPortal()?.type_page);
    this.router.navigate(['/personal-menu-page']);
  }
  goToLogout() {
    if(this.router.url === '/inicio'){
      return;
    }
    this.loadingService.setLoading(true);
    this.authService.logoutService().subscribe({
      next: (response) => { this.router.navigate(['/inicio']);},
      error: (error) => { this.router.navigate(['/inicio']);},
    });
   
  }
  goToLoginPaciente() {
    this.loadingService.setLoading(true);
    this.router.navigate(['/login-page']);
  }
  goToSignUpPaciente() {
    this.loadingService.setLoading(true);
    this.router.navigate(['/crear-contrasena-page']);
  }


}

