// Angular modules
import { Component }    from '@angular/core';
import { OnInit }       from '@angular/core';

// Internal modules
import { environment }  from '@env/environment';

// Services
import { StoreService } from '@services/store.service';

@Component({
  selector    : 'app-auth',
  templateUrl : './auth.component.html',
  styleUrls   : ['./auth.component.scss']
})
export class AuthComponent implements OnInit
{
  // NOTE Component properties
  public appName    : string  = environment.appName;
  public appVersion : string  = environment.version;

  constructor
  (
    public storeService : StoreService,
  )
  {

  }

  public ngOnInit() : void
  {
  }


}
