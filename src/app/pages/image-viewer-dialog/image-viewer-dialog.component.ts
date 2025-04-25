import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-viewer-dialog',
  imports: [MatIconModule],
  templateUrl: './image-viewer-dialog.component.html',
  styleUrl: './image-viewer-dialog.component.scss'
})
export class ImageViewerDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { url: string },
    private dialogRef: MatDialogRef<ImageViewerDialogComponent>
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
