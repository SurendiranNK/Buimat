import { Pipe, PipeTransform,ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

@Pipe({
    name: 'useHttpImgSrc',
    pure: false,
  })
export class SecurePipe implements PipeTransform {


    constructor(private sanitizer:DomSanitizer){}

    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

      
}