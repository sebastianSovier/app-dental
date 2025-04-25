import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';



if (environment.production) {
  enableProdMode();

  if (window) {
    window.console.log = () => {};
    window.console.warn = () => {};
    window.console.error = () => {};
  }
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
