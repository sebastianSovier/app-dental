import { Injectable } from "@angular/core";


@Injectable({
  providedIn: "root",
})
export class UtilsService {
  constructor() { }

  calculateAge(day: number, month: number, year: number): string {
    // Get the current date
    const today = new Date();
    const birthDate = new Date(year, month - 1, day); // month is 0-indexed

    // Calculate the difference in years
    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust age if the birthday hasn't occurred yet this year
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    // If birth month hasn't passed or the birth day hasn't passed, subtract one year from the age
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age.toString();
  }
  getActualDate(){
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }
  getBeforeDate(){
    const today = new Date(); // fecha actual
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() - 90);
    const day = String(futureDate.getDate()).padStart(2, '0');
    const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = futureDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }
  getBeforeDatDate(){
    const today = new Date(); // fecha actual
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() - 1);
    const day = String(futureDate.getDate()).padStart(2, '0');
    const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = futureDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }
  getFutureDate(){
    const today = new Date(); // fecha actual
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 30);
    const day = String(futureDate.getDate()).padStart(2, '0');
    const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = futureDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }
  getNextDate(){
    const today = new Date();
    const nextYear = new Date(today.setFullYear(today.getFullYear() + 1));
    
    const day = String(nextYear.getDate()).padStart(2, '0');
    const month = String(nextYear.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = nextYear.getFullYear();
    
    const formattedDateNextYear = `${day}/${month}/${year}`;
    return formattedDateNextYear;
  }
  
}
