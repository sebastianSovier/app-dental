import { LocationStrategy } from "@angular/common";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class PersistFormDataService {
  private formGroups: { [key: string]: FormGroup | null } = {};

  constructor() {
    this.formGroups = {
      formPersonalQuestionsData:null,
      formPersonalData: null,
      formContactData: null,
      formBirthdayData: null,
      crearCuentaForm: null,
      loginProfesionalFormForm: null,
      loginPacientesForm: null
    };
  }

  setForm(key: string, form: FormGroup) {
    if (this.formGroups.hasOwnProperty(key)) {
      this.formGroups[key] = form;
    }
  }
  
  getForm(key: string): FormGroup | null {
    return this.formGroups[key] || null;
  }

  clearForms() {
    Object.keys(this.formGroups).forEach((key) => {
      if (this.formGroups[key]) {
        this.formGroups[key] = null;
      }
    });
  }
 
 
}
