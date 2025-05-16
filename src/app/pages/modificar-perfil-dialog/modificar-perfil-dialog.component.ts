import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ImageViewerDialogComponent } from '../image-viewer-dialog/image-viewer-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modificar-perfil-dialog',
  imports: [MatSelectModule, MatFormFieldModule, MatDialogModule, MatButtonModule],
  templateUrl: './modificar-perfil-dialog.component.html',
  styleUrl: './modificar-perfil-dialog.component.scss'
})
export class ModificarPerfilDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id_perfil: string,rut:string,id_paciente:string,id_profesional:string,dv:string },
    private dialogRef: MatDialogRef<ImageViewerDialogComponent>
  ) {}
  perfilesFilter : {
    value: string;
    label: string;
}[] = [];
  perfilSeleccionado: string = ''; 
  ngOnInit() {
    this.perfilSeleccionado = this.data.id_perfil === '1' ? "Paciente" : this.data.id_perfil === '2' ? "Profesional" : this.data.id_perfil === '3' ? "Administrador" : "Deshabilitado";
      if (this.data.id_paciente) {
          this.perfilesFilter.push( { value: "4", label: 'Deshabilitado' });
          this.perfilesFilter.push( { value: "1", label: 'Paciente' });
        
      }else if (this.data.id_profesional) {
          this.perfilesFilter.push( { value: "4", label: 'Deshabilitado' });
          this.perfilesFilter.push( { value: "2", label: 'Profesional' });
        
      }
  }
  
  cerrar(): void {
    this.dialogRef.close();
  }
  onPerfilChange() {
    if(this.perfilSeleccionado !==this.data.id_perfil){ 
      this.dialogRef.close({perfil:this.perfilSeleccionado,rut: this.data.rut+this.data.dv});
    }
  }
}
