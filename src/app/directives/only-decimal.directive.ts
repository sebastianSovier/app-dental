import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[dirOnlyDecimal]',
  standalone:true
})
export class OnlyDecimalDirective {

  constructor(
    private el: ElementRef,
    @Optional() @Self() private control: NgControl 
  ) {}

  
  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;

    const regex = /^\d(\.\d{0,2})?$/;

    if (!regex.test(input.value)) {
      const sanitizedValue = input.value
        .replace(/[^0-9.]/g, '')        
        .replace(/(\..*)\./g, '$1')     
        .replace(/^(\d)\.(\d{0,2}).*/, '$1.$2'); 
    

    if (sanitizedValue !== input.value) {
      if (this.control && this.control.control) {
        this.control.control.setValue(sanitizedValue); 
      } else {
        input.value = sanitizedValue; 
      }
    }
  }
}
}