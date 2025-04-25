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
import { SweetAlertService } from '@services/sweet-alert.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserDataService } from '@services/user-data.service';
import { AuthService } from '@services/auth.service';
import { MatIconModule } from '@angular/material/icon';

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
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  isSidebarToggled = false;
  isToggled = false;
  showHistoryTab = false;
  showLoginPageTab = false;
  showOtherTabs = false;
  showLogoutButton = true;
  isSticky = false;
  private readonly authService = inject(AuthService);
  public insuredData = inject(UserDataService);
  constructor(
    public router: Router,
    private sweetAlertService: SweetAlertService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  goToLoginProfesional() {
    this.router.navigate(['/login-professional-page']);
  }
  goToMenu() {
    console.log(this.insuredData.currentPortal()?.type_page);
    this.router.navigate(['/personal-menu-page']);
  }
  goToLogout() {
    this.authService.logoutService().subscribe({
      next: (response) => { this.router.navigate(['/inicio']);},
      error: (error) => { this.router.navigate(['/inicio']);},
    });
   
  }
  goToLoginPaciente() {
    this.router.navigate(['/login-page']);
  }
  goToSignUpPaciente() {
    this.router.navigate(['/crear-contrasena-page']);
  }

  openDialog() {
    const dialogRef = this.dialog.open(this.dialogTemplate, {
      data: { name: 'John Doe' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El diálogo se cerró', result);
    });
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll(): void {
    const scrollPosition =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.isSticky = scrollPosition >= 50;
  }

  onLogout(): void {
    this.sweetAlertService.showSweetAlert('header', 'logout:01');
  }

  hideMobileMenu(): void {
    const menu = document.getElementById('menu-mobile');
    menu?.classList.remove('visible');
  }
}

// src/app/toggle-menu.ts

export class ToggleMenu {
  private button: HTMLElement | null;
  private menu: HTMLElement | null;

  constructor(buttonId: string, menuId: string) {
    this.button = document.getElementById(buttonId);
    this.menu = document.getElementById(menuId);
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.button?.addEventListener('click', () => this.toggleMenu());
  }

  private toggleMenu(): void {
    this.menu?.classList.toggle('visible');
  }
}
