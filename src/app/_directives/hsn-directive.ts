
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHSN]'
})
export class HSNDirective {
  @Input() maxLength: number = 10;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const inputValue: string = inputElement.value.trim();

    // Remove non-numeric characters and limit length
    const numericValue: string = inputValue.replace(/[^\d]/g, '').slice(0, this.maxLength);

    // Update the input value
    if (inputValue !== numericValue) {
      inputElement.value = numericValue;
      inputElement.dispatchEvent(new Event('input'));
    }
  }
}