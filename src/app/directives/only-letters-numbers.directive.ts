import { Directive, HostListener, ElementRef, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[dirOnlyLettersNumbers]',
  standalone:true
})
export class OnlyLettersNumbersDirective {

  constructor(
    private el: ElementRef,
    @Optional() @Self() private control: NgControl 
  ) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;
    
    const sanitizedValue = input.value
      .replace(/[^a-zA-Z0-9\s]/g, '') 
      .replace(/\s{2,}/g, ' ')        
      .trimStart(); 
       
    if (sanitizedValue !== input.value) {
      if (this.control && this.control.control) {
        this.control.control.setValue(sanitizedValue); 
      } else {
        input.value = sanitizedValue; 
      }
    }
  }
}
