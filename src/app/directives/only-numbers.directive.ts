import { Directive, HostListener, Input, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[dirOnlyNumbers]',
  standalone: true
})
export class OnlyNumbersDirective {
  @Input('dirOnlyNumbers') maxDigits: number = 10; 

  constructor(@Optional() @Self() private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;

    let sanitizedValue = input.value.replace(/[^0-9]/g, '').replace(/[eE]/g, '');


    if (sanitizedValue.length > this.maxDigits) {
      sanitizedValue = sanitizedValue.substring(0, this.maxDigits);
    }

    if (sanitizedValue !== input.value) {
      if (this.control && this.control.control) {
        this.control.control.setValue(sanitizedValue); 
      } else {
        input.value = sanitizedValue;
      }
    }
  }
}
