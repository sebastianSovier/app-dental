import { Directive, forwardRef } from "@angular/core";
import { FormControl, NG_VALIDATORS } from "@angular/forms";
export function validateSerialFactory() {
  return (c: FormControl) => {
    return algoritmoSerie(c) ? null : { invalidSerial: true };
  };
}
@Directive({
  selector: "[ValidaSerial][formControl]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SerialValidator),
      multi: true,
    },
  ],
})
export class SerialValidator {
  private readonly validator: Function;
  constructor() {
    this.validator = validateSerialFactory();
  }
  public validate(c: FormControl) {
    return this.validator(c);
  }
}
export function algoritmoSerie(c: FormControl): boolean {
  const value = c.value;
  if(value){
    const regexp = new RegExp(
      value.charAt(0) !== "A"
        ? "^[0-9]{1,3}(\\.[0-9]{3}){2}$"  
        : "^A[0-9]{1,3}(\\.[0-9]{3}){2}$",
      "g"
    );
    return regexp.test(value);
  }else{
    return true;
  }
  
 
}
