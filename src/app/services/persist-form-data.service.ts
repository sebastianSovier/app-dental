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
      formWelcomeData:null,
      formNameData: null,
      formIdentificationData: null,
      formContactData: null,
      formBirthdayData: null,
      formAboutMeData: null,
      formHealthQuestionsData: null,
      formSpecialRiskData: null,
      formSpecialRiskTwoData: null,
      formSwornDeclaration: null,
      formHealthInsurancePlans: null,
      formHealthInsurancePlanSelected: null,
      formBeneficiaries: null,
      formBeneficiary: null,
      formChosenPlan: null
    };
  }

  setForm(key: string, form: FormGroup) {
    if (this.formGroups.hasOwnProperty(key)) {
      this.formGroups[key] = form;
    }
  }
  checkValidForms(){
    let valid = true;
    Object.keys(this.formGroups).forEach((key) => {
      if(valid === false){
        return;
      }
      if (this.formGroups[key] !== null && this.formGroups[key]?.invalid) {
        valid = false;
      }else if(this.formGroups[key] === null && key !== "formBeneficiary"){
        valid = false;
      }else{
        return;
      }
    });
    return valid;
  }
  checkValidFormsChosenPlan(){
    let valid = true;
    Object.keys(this.formGroups).forEach((key) => {
      if(valid === false){
        return;
      }
      if (this.formGroups[key] !== null && this.formGroups[key]?.invalid) {
        valid = false;
      }else if(this.formGroups[key] === null && key !== "formBeneficiary" && key !== "formChosenPlan"){
        valid = false;
      }else{
        return;
      }
    });
    return valid;
  }
  formsPersonalData = ["formNameData","formIdentificationData","formContactData","formBirthdayData"];

  checkValidPersonalDataForms(){
    let valid = true;
    this.formsPersonalData.forEach(element => {
      if(valid === false){
        return;
      }
      if (this.formGroups[element] === null || this.formGroups[element]?.invalid) {
        valid  = false;
      }
    });
    return valid;
  }
  formsPersonalHealthData = ["formAboutMeData","formHealthQuestionsData","formSpecialRiskData","formSpecialRiskTwoData"];

  checkPersonalHealthDataForms(){
    let valid = true;
    this.formsPersonalHealthData.forEach(element => {
      if(valid === false){
        return;
      }
      if (this.formGroups[element] === null || this.formGroups[element]?.invalid) {
        valid  = false;
      }
    });
    return valid;
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
