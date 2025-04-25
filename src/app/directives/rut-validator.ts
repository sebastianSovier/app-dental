import { Directive, forwardRef } from "@angular/core";
import { FormControl, NG_VALIDATORS } from "@angular/forms";
import * as rutHelpers from "rut-helpers";
export function validateSerialFactory() {
  return (c: FormControl) => {
    return rutValidacion(c) ? null : { invalidRut: true };
  };
}
@Directive({
  selector: "[ValidaRut][formControl]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => rutValidator),
      multi: true,
    },
  ],
})
export class rutValidator {
  private readonly validator: Function;
  constructor() {
    this.validator = validateSerialFactory();
  }
  public validate(c: FormControl) {
    return this.validator(c);
  }
}
export function rutValidacion(c: FormControl): boolean {
  let rut = c.value;
  let rutValidado = rutHelpers.rutValidate(rut);
  return rutValidado;
}
