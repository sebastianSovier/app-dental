import {
  ApplicationConfig,
  LOCALE_ID,
  provideZoneChangeDetection, isDevMode,
} from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  provideHttpClient,
  withXsrfConfiguration,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
  withFetch,
} from '@angular/common/http';
import localeEsCL from '@angular/common/locales/es-CL'; // Importa el locale para Chile

import { AuthInterceptorServiceService } from './services/auth-interceptor-service.service';
import { registerLocaleData } from '@angular/common';
import { provideServiceWorker } from '@angular/service-worker';
registerLocaleData(localeEsCL, 'es-CL');
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    {
      provide: LOCALE_ID,
      useValue: 'es-CL',
    },
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    provideHttpClient(
      withFetch(),
      withXsrfConfiguration({
        cookieName: 'Q',
        headerName: 'X-Q',
      }),
      withInterceptorsFromDi()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorServiceService,
      multi: true,
    }, provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
};
