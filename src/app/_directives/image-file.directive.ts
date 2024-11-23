// image-file.directive.ts

import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appImageFile]'
})
export class ImageFileDirective {

  constructor(private el: ElementRef) { }

  @HostListener('change', ['$event'])
  onChange(event: any) {
    const files = event.target.files;

    if (files.length > 0) {
      const file = files[0];
      const fileType = file.type;

      if (!fileType.startsWith('image/')) {
        // Clear the input if the file is not an image
        this.el.nativeElement.value = '';
        alert('Please select a valid image file.');
      }
    }
  }
}
