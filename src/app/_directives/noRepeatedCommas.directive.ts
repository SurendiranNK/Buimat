import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[noRepeatedCommas]'
})
export class NoRepeatedCommasDirective {

  @HostListener('input', ['$event.target'])
  onKeyDown(input: HTMLInputElement) {
    const value = input.value;
    const newValue = value.replace(/,{2,}/g, ','); // Replace consecutive commas with a single comma
    if (value !== newValue) {
      input.value = newValue; // Update the input value if it's changed
      input.dispatchEvent(new Event('input')); // Dispatch input event to trigger Angular binding
    }
  }

}