import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[type="number"][appNoDecimal]'
})
export class NoDecimalDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const inputValue = this.el.nativeElement.value;

    // Remove any non-digit characters (including decimals)
    const newValue = inputValue.replace(/[^\d]/g, '');

    this.el.nativeElement.value = newValue;

    if (inputValue !== this.el.nativeElement.value) {
      event.stopPropagation(); // Stop the event if the value was changed
    }
  }
}