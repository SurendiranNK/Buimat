// two-digit.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTwoDigit]'
})
export class TwoDigitDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    let inputValue = inputElement.value;

    // Allow only digits
    inputValue = inputValue.replace(/[^0-9]/g, '');

    // Limit to two digits
    inputValue = inputValue.slice(0, 2);

    // Update the input value
    inputElement.value = inputValue;
  }
}