// Angular modules
import { Component }    from '@angular/core';
import { FormGroup }    from '@angular/forms';
import { FormControl }  from '@angular/forms';
import { Validators }   from '@angular/forms';
import { Router }       from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

// Internal modules
import { environment }  from '@env/environment';

// Services
import { AppService }   from '@services/app.service';
import { StoreService } from '@services/store.service';
import { AuthenticationService } from '../../../../_services/authentication.service';

@Component({
  selector    : 'app-login',
  templateUrl : './login.component.html',
  styleUrls   : ['./login.component.css']
})
export class LoginComponent
{
  public appName : string = environment.appName;
  public formGroup !: FormGroup<{
    email    : FormControl<string>,
    password : FormControl<string>,
    remember : FormControl<Boolean>,
  }>;
  error = '';

  constructor
  (
    private router       : Router,
    private storeService : StoreService,
    private appService   : AppService,
    private authenticationService: AuthenticationService

  )
  {
    this.initFormGroup();
  }

  // -------------------------------------------------------------------------------
  // NOTE Init ---------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private initFormGroup() : void
  {
    this.formGroup = new FormGroup({
      email      : new FormControl<string>({
        value    : '',
        disabled : false
      }, { validators : [Validators.required, Validators.email], nonNullable : true }),

      password   : new FormControl<string>({
        value    : '',
        disabled : false
      }, { validators : [Validators.required], nonNullable : true }),

      remember   : new FormControl<Boolean>({
        value    : false,
        disabled : false
      },{ validators : [], nonNullable : true }),
    });

    this.checkIsRemember();
  }

  // -------------------------------------------------------------------------------
  // NOTE Actions ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

  public async onClickSubmit() : Promise<void>
  {
    await this.authenticate();


  }
  public async onOTPSubmit() : Promise<void>
  {


  }

  // -------------------------------------------------------------------------------
  // NOTE Requests -----------------------------------------------------------------
  // -------------------------------------------------------------------------------

  private async authenticate() : Promise<void>
  {
    this.storeService.setIsLoading(true);

    const email    = this.formGroup.controls.email.getRawValue();
    const password = this.formGroup.controls.password.getRawValue();
    const remember = this.formGroup.controls.remember.getRawValue();

    const success  = await this.appService.authenticate(email, password);



    this.storeService.setIsLoading(false);

    const _data ={
      "email":email,
      "password":password,
      "remember":remember
      }
      this.authenticationService.login(_data)
      .pipe(first())
      .subscribe({
          next: () => {
            Swal.fire({
              title: "Success",
              text: "Login Successfull. Welcome to Buimat",
              timer:1200,
              icon: "success"
            });
          this.router.navigate(['/admin']);
        },
          error: error => {
              this.error = error;
              Swal.fire("Error!",error.error.message,  "error")   
          }
      });
  }

  checkIsRemember() {
    var userdata_ = localStorage.getItem('adminInfo')!;
    var parsedUserData = JSON.parse(userdata_);
    console.log(parsedUserData)
    if(parsedUserData!==null){
      if(parsedUserData.remember){
        this.formGroup.controls.email.setValue(parsedUserData.email);
        this.formGroup.controls.password.setValue(parsedUserData.password);
        this.formGroup.controls.remember.setValue(true);
      }else{
        this.formGroup.controls.email.setValue("");
        this.formGroup.controls.password.setValue("");
        this.formGroup.controls.remember.setValue(false);
      }
    }

  }

  // -------------------------------------------------------------------------------
  // NOTE Helpers ------------------------------------------------------------------
  // -------------------------------------------------------------------------------

}
