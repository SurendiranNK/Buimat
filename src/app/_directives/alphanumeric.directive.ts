// alphanumeric.directive.ts

import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphanumeric]'
})
export class AlphanumericDirective {


  constructor(private el: ElementRef) { }
  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const inputValue = this.el.nativeElement.value;
    
    // Allow only numbers and commas
    const newValue = inputValue.replace(/[^a-zA-Z0-9,]/g, '');

    // Ensure that a comma doesn't come first and remove repeated commas
    const sanitizedValue = newValue.replace(/^,+/g, '').replace(/,{2,}/g, ',');

    this.el.nativeElement.value = sanitizedValue;

    if (inputValue !== this.el.nativeElement.value) {
      event.stopPropagation(); // Stop the event if the value was changed
    }
  }
}
