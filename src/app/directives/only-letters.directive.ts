import { Directive, ElementRef, HostListener, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[dirOnlyLetters]',
  standalone:true
})
export class OnlyLettersDirective {

  constructor(
    private el: ElementRef,
    @Optional() @Self() private control: NgControl
  ) {}


  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;

    const sanitizedValue = input.value
      .replace(/[^a-zA-Z\s]/g, '')           
      .replace(/\s{2,}/g, ' ')                
      .replace(/^\s+/, '')                    
      .replace(/(\s)(?=\s)|(\s)(?=[^a-zA-Z])/g, '');

   if (sanitizedValue !== input.value) {
    if (this.control && this.control.control) {
      this.control.control.setValue(sanitizedValue); 
    } else {
      input.value = sanitizedValue; 
    }
  }
}
}
