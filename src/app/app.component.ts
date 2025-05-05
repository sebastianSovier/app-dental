import { Component } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { PreventService } from './services/prevent.service';
import { LoadingPageService } from './services/loading-page.service';
import { filter } from 'rxjs';
import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy,
  Location
} from '@angular/common';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './common/header/header.component';
import { LoadingPageComponent } from './common/loading-page/loading-page.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MatCardModule,
    LoadingPageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    Location,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
  ],
})
export class AppComponent {
  title = 'app-dental';
  routerSubscription: any;

  constructor(
    public router: Router,
    private prevent: PreventService,
    private loading: LoadingPageService
  ) {}

  ngOnInit() {
    this.recallJsFuntions();
  }
  // recallJsFuntions
  recallJsFuntions() {
    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationStart ||
            event instanceof NavigationCancel ||
            event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        this.prevent.preventBackButton();
        if ((event instanceof NavigationStart)) {
          this.loading.setLoading(true);
        }
       
        if (!(event instanceof NavigationEnd)) {
          return;
        } else {
          this.loading.setDisabledButton(false);
          this.loading.setLoading(false);
        }
      //  window.scrollTo(0, 0);
      });
  }
}
