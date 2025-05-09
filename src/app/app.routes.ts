import { Routes } from '@angular/router';
import { privateGuard } from './auth/guards/private.guard';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { roleGuard } from './auth/guards/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    {
        path: 'inicio',
        loadComponent: () => import('./pages/welcome-page/welcome-page.component').then(m => m.default),
    },
    {
        path: 'agendamiento-page',
        loadComponent: () => import('./pages/agendamiento-page/agendamiento-page.component').then(m => m.default),
    },
    {
        path: 'agendamiento-usuario-page',
        loadComponent: () => import('./pages/agendamiento-page/agendamiento-page.component').then(m => m.default),
        canActivate: [privateGuard],
    },
    {
        path: 'login-page',
        loadComponent: () => import('./pages/login-page/login-page.component').then(m => m.default),
    },
    {
        path: 'crear-contrasena-page',
        loadComponent: () => import('./pages/crear-cuenta/crear-cuenta.component').then(m => m.default),
        canActivate: [privateGuard],
    },
    {
        path: 'personal-menu-page',
        loadComponent: () => import('./pages/personal-menu-page/personal-menu-page.component').then(m => m.default),
        canActivate: [privateGuard],
    },
    {
        path: 'proximas-atenciones-page',
        loadComponent: () => import('./pages/proximas-atenciones-page/proximas-atenciones-page.component').then(m => m.default),
        canActivate: [privateGuard],
    },
    {
        path: 'historial-atenciones-page',
        loadComponent: () => import('./pages/historial-atenciones-page/historial-atenciones-page.component').then(m => m.default),
        canActivate: [privateGuard],
    },
    {
        path: 'consulta-medica-page',
        loadComponent: () => import('./pages/consulta-medica-page/consulta-medica-page.component').then(m => m.default),
        canActivate: [privateGuard],
    }, 
    {
        path: 'evaluar-atencion-page',
        loadComponent: () => import('./pages/evaluacion-doctor-page/evaluacion-doctor-page.component').then(m => m.default),
        canActivate: [privateGuard,roleGuard],
    }, 
    {
        path: 'carga-examenes-page',
        loadComponent: () => import('./pages/carga-imagenes-examen/carga-imagenes-examen.component').then(m => m.default),
        canActivate: [privateGuard],
    },
    {
        path: 'visualizar-examenes-page',
        loadComponent: () => import('./pages/visualizar-examenes-paciente/visualizar-examenes-paciente.component').then(m => m.default),
        canActivate: [privateGuard],
    },
    {
        path: 'administrador-page',
        loadComponent: () => import('./pages/administrador-page/administrador-page.component').then(m => m.default),
        canActivate: [privateGuard,roleGuard],
    },
    {
        path: 'crear-profesional-page',
        loadComponent: () => import('./pages/create-profesional/create-profesional.component').then(m => m.default),
        canActivate: [privateGuard,roleGuard],
    },  
    {
        path: 'ver-tratamiento-consulta-page',
        loadComponent: () => import('./pages/tratamientos-consulta-paciente/tratamientos-consulta-paciente.component').then(m => m.default),
        canActivate: [privateGuard],
    },
    {
        path: 'gestionar-agenda-profesional-page',
        loadComponent: () => import('./pages/gestion-agenda-profesional-page/gestion-agenda-profesional-page.component').then(m => m.default),
        canActivate: [privateGuard],
    },  
    {
        path: 'error-page', component: ErrorPageComponent,
    },
    { path: '**', component: ErrorPageComponent }
];
