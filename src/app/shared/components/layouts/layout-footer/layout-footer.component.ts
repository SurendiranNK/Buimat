import { Component } from '@angular/core';
import { OnInit }      from '@angular/core';
import { Router }      from '@angular/router';
import { environment } from '@env/environment';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {far} from '@fortawesome/free-regular-svg-icons';
import {fas} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-layout-footer',
  templateUrl: './layout-footer.component.html',
  styleUrls: ['./layout-footer.component.css']
})
export class LayoutFooterComponent implements OnInit
{
  faEnvelope = faEnvelope;
  public appName         : string  = environment.appName;
  public isMenuCollapsed : boolean = true;
  baseURL = '';
  constructor
  (
    library: FaIconLibrary,

    private router : Router,
  )
  {
    library.addIconPacks(fas, far);

  }

  public ngOnInit() : void
  {
    this.baseURL = environment.apiBaseUrl
  }
  callPage(val:number){
    switch(val) { 
      case 1: { 
        this.router.navigate(['/about-us']);
        break; 
      } 
      case 2: { 
         this.router.navigate(['/terms-conditions']);
         break; 
      } 
      case 3: { 
        this.router.navigate(['/contact']);
        break; 
      } 
      case 4: { 
         this.router.navigate(['/policy']);
         break; 
      } 
      case 5: { 
        this.router.navigate(['/checkout']);
        break; 
      } 
      case 6: { 
        this.router.navigate(['/seller-agreement']);
        break; 
      } 
      case 7: { 
        this.router.navigate(['/agreement']);
        break; 
      } 
      case 8: { 
        this.router.navigate(['/refund']);
        break; 
      } 
      default: { 
         //statements; 
         break; 
      } 
   } 

  }


}
