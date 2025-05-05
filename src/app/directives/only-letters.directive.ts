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

 // Intercepta el evento de pegado
 @HostListener('paste', ['$event'])
 onPaste(event: ClipboardEvent) {
   event.preventDefault();
   const clipboardData = event.clipboardData;
   const pastedText = clipboardData?.getData('text') || '';
   const sanitizedText = this.cleanText(pastedText);
   this.updateValue(sanitizedText);
 }
 @HostListener('input', ['$event'])
 onInputChange(event: Event) {
   this.sanitizeInput();
 }

private sanitizeInput() {
  const input = this.el.nativeElement as HTMLInputElement;
  const sanitizedValue = this.cleanText(input.value);
  this.updateValue(sanitizedValue);
}

// Actualiza el valor del input y del control de formulario si es necesario
private updateValue(value: string) {
  const input = this.el.nativeElement as HTMLInputElement;
  if (this.control && this.control.control) {
    this.control.control.setValue(value, { emitEvent: false });
  } else {
    input.value = value;
  }
}
private cleanText(value: string): string {
  return value.toUpperCase().normalize('NFD')
  .replace(/[^a-zA-ZÑñ\s]/g, '')           
  .replace(/\s{2,}/g, ' ')                
  .replace(/^\s+/, '')
               
  .replace(/(\s)(?=\s)|(\s)(?=[^a-zA-Z])/g, '');
}
}
