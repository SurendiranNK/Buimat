// comma-separated.directive.ts

// import { Directive, ElementRef, HostListener } from '@angular/core';

// @Directive({
//   selector: '[appCommaSeparated]'
// })
// export class CommaSeparatedDirective {

//   constructor(private el: ElementRef) { }
//   @HostListener('input', ['$event'])
//   onInputChange(event: any) {
//     const inputValue = this.el.nativeElement.value;
    
//     // Allow only numbers and commas
//     const newValue = inputValue.replace(/[^0-9,]/g, '');

//     // Ensure that a comma doesn't come first and remove repeated commas
//     const sanitizedValue = newValue.replace(/^,+/g, '').replace(/,{2,}/g, ',');

//     this.el.nativeElement.value = sanitizedValue;

//     if (inputValue !== this.el.nativeElement.value) {
//       event.stopPropagation(); // Stop the event if the value was changed
//     }

    
//   }
// }

import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appCommaSeparated]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CommaSeparatedDirective, multi: true }]
})
export class CommaSeparatedDirective implements Validator {
  @Input('appCommaSeparated') pincode: string;

  validate(control: AbstractControl): { [key: string]: any } | null {
    const isValid = /^[0-9]{6}(,[0-9]{6})*$/.test(control.value);

    return isValid ? null : { 'invalidPincode': true };
  }
}