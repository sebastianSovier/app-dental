import { Injectable, inject } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as rutHelpers from "rut-helpers";

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {
  errorMessages: Record<string, string> = {
    maxlength: 'Ingrese un maximo de caracteres',
    minlength: 'Ingrese un minimo de caracteres',
    email: 'Ingrese email válido',
    required: 'Recuerda completar este campo',
    pattern: 'Ingrese caracteres válidos',
    invalidDate:'Fecha inválida',
    underage:'Debe ser mayor de 18 años.',
    max:"Número inválido",
    min:"Número inválido",
    invalidRut:"Rut ingresado no válido",
  };
  isValidInput(fieldName: string | number,form: UntypedFormGroup): boolean {
    return form.controls[fieldName].invalid && form.controls[fieldName].touched;
  }
  
  errors(control: AbstractControl | null): string[] {
    if(control === null){
      return [];
    }else{
      return control.errors ? Object.keys(control.errors) : [];
    }
  }
  passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const contrasena = group.get('contrasena')?.value;
    const repetirContrasena = group.get('repetirContrasena')?.value;
    
    return contrasena === repetirContrasena ? null : { passwordMismatch: true };
  };
  validateDateAndAge(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const dayControl = formGroup.get('day');
      const monthControl = formGroup.get('month');
      const yearControl = formGroup.get('year');
  
      const day = dayControl?.value;
      const month = monthControl?.value;
      const year = yearControl?.value;
  
      if (day && month && year) {
        const date = new Date(year, month - 1, day); 
        const today = new Date();
  
        const isValidDate = date.getFullYear() === +year && date.getMonth() + 1 === +month && date.getDate() === +day;
        if (!isValidDate) {
          return { invalidDate: true }; 
        }
  
        const age = today.getFullYear() - year;
        const isBirthdayPassedThisYear = (today.getMonth() > (month - 1)) || 
                                         (today.getMonth() === (month - 1) && today.getDate() >= day);
  
        if (age > 18 || (age === 18 && isBirthdayPassedThisYear)) {
          return null; 
        } else {
          return { underage: true }; 
        }
      }
  
      return null;
    };
  }
  
}
