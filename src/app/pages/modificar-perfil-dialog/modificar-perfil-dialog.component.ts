import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ImageViewerDialogComponent } from '../image-viewer-dialog/image-viewer-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modificar-perfil-dialog',
  imports: [MatSelectModule,MatFormFieldModule,CommonModule,MatDialogModule],
  templateUrl: './modificar-perfil-dialog.component.html',
  styleUrl: './modificar-perfil-dialog.component.scss'
})
export class ModificarPerfilDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id_perfil: string,rut:string },
    private dialogRef: MatDialogRef<ImageViewerDialogComponent>
  ) {}
  perfiles = [
    { value: "1", label: 'Paciente' },
    { value: "2", label: 'Profesional' },
    { value: "3", label: 'Administrador' }
  ];
  perfilSeleccionado: string = ''; 
  ngOnInit() {
    this.perfilSeleccionado = this.data.id_perfil === '1' ? "Paciente" : this.data.id_perfil === '2' ? "Profesional" : "Administrador";
  }
  cerrar(): void {
    this.dialogRef.close();
  }
  onPerfilChange() {
    this.dialogRef.close({perfil:this.perfilSeleccionado,rut: this.data.rut});
  }
}
