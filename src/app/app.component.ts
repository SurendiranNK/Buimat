
import { Component }        from '@angular/core';
import { OnInit, }           from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment'
import { Router, NavigationEnd  } from '@angular/router';

// External modules
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector    : 'app-root',
  templateUrl : './app.component.html',
  styleUrls   : ['./app.component.scss']
})
export class AppComponent implements OnInit
{
  public lat;
  public lng;
  constructor
  (
    private translateService : TranslateService,
    private http: HttpClient,
    private router : Router,    

  )
  {
    // NOTE This language will be used as a fallback when a translation isn't found in the current language
    this.translateService.setDefaultLang('en');
    // NOTE The lang to use, if the lang isn't available, it will use the current loader to get them
    // let userLanguage = StorageHelper.getLanguage();
    // if (!userLanguage)
    let userLanguage = 'en';
    this.translateService.use(userLanguage);
    
  }

  // -------------------------------------------------------------------------------
  // NOTE Init ---------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public ngOnInit() : void
  
  {
    //this.getLocation();
  }

   /* getLocation(): void{
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position)=>{
            const longitude = position.coords.longitude;
            const latitude = position.coords.latitude;
            this.getZipCode(latitude, longitude);
          
          });
      } else {
        console.log("No support for geolocation")
      }
    }
    async getZipCode (latitude: number, longitude: number) {
      var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${environment.googleMapsApiKey}`
      let response = await fetch(url)
      let data = await response.json()
      var results = data.results
      console.log("geo - - "+JSON.stringify(results[0]))

  }*/
    


     
  }
  
  // -------------------------------------------------------------------------------
  // NOTE Actions ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Computed props -----------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Helpers ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Requests -----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------
  // NOTE Subscriptions ------------------------------------------------------------
  // -------------------------------------------------------------------------------

