import {  Inject, Injectable, PLATFORM_ID } from "@angular/core";

import { isPlatformBrowser, LocationStrategy } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class PreventService {
 
  constructor(private locationStrategy: LocationStrategy,@Inject(PLATFORM_ID) private platformId: any) {
  }

  preventBackButton() {
    if (isPlatformBrowser(this.platformId)) {
      history.pushState(null, '', window.location.href);
      window.onpopstate = function () {
        history.pushState(null, '', window.location.href);
      };
    }
}
}