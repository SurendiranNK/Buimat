// integer-only.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appIntegerOnly]'
})
export class IntegerOnlyDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent): void {
    const inputValue: string = this.el.nativeElement.value;
    this.el.nativeElement.value = inputValue.replace(/[^0-9]/g, '');
  }
}