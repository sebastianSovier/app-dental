import { Component, inject, OnInit } from '@angular/core';
import { LoadingPageService } from '../../services/loading-page.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: "app-loading-page",
  standalone: true,
  imports: [CommonModule,MatProgressSpinnerModule
  ],
  templateUrl: "./loading-page.component.html",
  styleUrl: "./loading-page.component.scss",
})
export class LoadingPageComponent {
  private loadingService = inject(LoadingPageService);

  show = this.loadingService.showLoading$;




 
}