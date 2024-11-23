// Angular modules
import { Component,OnInit,ViewChild,TemplateRef }    from '@angular/core';
import { FormControl }  from '@angular/forms';
import { UntypedFormBuilder, Validators, FormGroup } from '@angular/forms';

import { Router }       from '@angular/router';
import { WindowService } from '../../../../window.service'
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';

// Internal modules
import { environment }  from '@env/environment';

// Services
import { AppService }   from '@services/app.service';
import { StoreService } from '@services/store.service';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-mobile-verification',
  templateUrl: './mobile-verification.component.html',
  styleUrls: ['./mobile-verification.component.css']
})

export class MobileVerificationComponent implements OnInit {
  windowRef: any;
  phone: any;
  verificationCode: string;
  user: any;
  nSubModule = 1;
  error="";
  form: FormGroup;
  otpForm: FormGroup;
  isSubmit= false;
  display: any;
  resendOtp: boolean = false;
  displayTimer: boolean = false;
  isEmailLogin:boolean = false;

  public formGroup !: FormGroup<{
    email    : FormControl<string>,
    password : FormControl<string>,
  }>;

  otp: string; showOtpComponent = true; 
  @ViewChild(NgOtpInputComponent, { static: false}) ngOtpInput:NgOtpInputComponent;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;


  config :NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: true,
    placeholder: ''
  };


  

    constructor(private win: WindowService,      
        private router       : Router,
        private formBuilder: UntypedFormBuilder,    
        private storeService : StoreService,
        private appService   : AppService,
        private modalService: NgbModal,
        private authenticationService: AuthenticationService
      ) {}
    get fb() { return this.form.controls; }

    ngOnInit() {
     this.form = this.formBuilder.group({
       mobile:['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    });

    this.formGroup = new FormGroup({
      email      : new FormControl<string>({
        value    : '',
        disabled : false
      }, { validators : [Validators.required, Validators.email], nonNullable : true }),

      password   : new FormControl<string>({
        value    : '',
        disabled : false
      }, { validators : [Validators.required], nonNullable : true }),
    });

    // this.formGroup.patchValue({
    //   email: "nalini.seesaw@gmail.com",
    //   password:"12345678"
    // })



  }
  onOtpChange(otp) {
    this.otp = otp;
  }

  public async onEmailLogin() : Promise<void>
  {
    await this.authenticateEmail();
  }
  onBackClick(){
    this.nSubModule = 1;
  }
  public async onClickSubmit() : Promise<void>{
    if(this.nSubModule == 1){

      this.isSubmit = true;
      if (this.form.invalid) {
        return;
      }
      await this.authenticate();
    }
  }
  private async authenticateEmail() : Promise<void>{
    const email    = this.formGroup.controls.email.getRawValue();
    const password = this.formGroup.controls.password.getRawValue();

    const success  = await this.appService.authenticate(email, password);

    this.storeService.setIsLoading(false);

    const _data ={
      "email":email,
      "password":password,
      }
      this.authenticationService.userLogin(_data)
      .pipe(first())
      .subscribe({
          next: (data) => {
          localStorage.clear();
          localStorage.setItem('userInfo', JSON.stringify(data.data.user));
          localStorage.setItem("token",data.data.token)
          localStorage.setItem("role",data.data.user.role)
          Swal.fire({
            title: "Success",
            text: "Login Successfull. Welcome to Buimat",
            timer:1500,
            icon: "success"
          });

          this.router.navigate(['/home']);
        },
          error: error => {
            console.log(JSON.stringify(error))
              if(!error.error.data.isEmailVerified){
                this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title',size:'md', windowClass: 'center-modal'}).result.then((result) => {
                }, (reason) => {
                });
              }else{
                Swal.fire({
                  text: error.error.message,
                  icon: "error",
                  timer: 1500
                });
              }
           
          }
      });
  }
  private async authenticate() : Promise<void>{
      this.phone = this.form.get('mobile')?.value
    
      const _data ={
          "mobileNo": "+91"+this.phone
      }
      this.authenticationService.sendOTP(_data)
      .pipe(first())
      .subscribe({
       next: (data) => {
          if(data.status){
              this.nSubModule = 2; 
              this.start(1);
              Swal.fire('Success', data.message, 'success');
          }
        },
          error: error => {
              this.error = error;
              Swal.fire("Please try again!","Error",  "error")   
          }
      });

  }

  onOTPSubmit(){
    if(this.otp.length<6){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid OTP",
      });
    }else{
      this.phone = this.form.get('mobile')?.value
      const _data ={
        "mobileNo": "+91"+this.phone,
        "otp":this.otp,
        "isRegister": false 
       }
       this.authenticationService.verifyOTP(_data)
       .pipe(first())
       .subscribe({
        next: (data) => {
           if(data.status){
              if(!data.data.isRegistered){
                this.router.navigate(['/kyc']);
              }else{
                localStorage.setItem('userInfo', JSON.stringify(data.data.user));
                localStorage.setItem("token",data.data.token)
                localStorage.setItem("role",data.data.user.role)
                this.router.navigate(['/home']);
              }
           }else{
            Swal.fire(
              'In Progress!',
               data.message,
              'question'
            )
          
           }
         },
           error: error => {
               this.error = error;
               Swal.fire("Please try again!","Error",  "error")   
           }
       });
 
    }
}
getEmail(){
  return this.formGroup.controls.email.getRawValue()
}
resendEmail(){
      this.modalService.dismissAll()

      const email    = this.formGroup.controls.email.getRawValue();
      const _data ={
              "email": email
          }
      this.authenticationService.resendEmail(_data)
      .pipe(first())
      .subscribe({
        next: (data) => {
          if(data.status){
              Swal.fire('Success', data.message, 'success');
          }
        },
          error: error => {
              this.error = error;
              Swal.fire("Please try again!","Error",  "error")   
          }
      });
}

onChange(event){
  const isChecked: boolean = event.target['checked'];
  this.isEmailLogin = !this.isEmailLogin;
}

start(minute) {
  this.displayTimer = true;
  this.resendOtp = false;
  // let minute = 1;
  let seconds = minute * 60;
  let textSec: any = '0';
  let statSec = 60;

  const prefix = minute < 10 ? '0' : '';

  const timer = setInterval(() => {
    seconds--;
    if (statSec != 0) statSec--;
    else statSec = 59;

    // if (statSec < 10) textSec = "0" + statSec;
    // textSec = statSec;

    if (statSec < 10) {
      console.log('inside', statSec);
      textSec = '0' + statSec;
    } else {
      console.log('else', statSec);
      textSec = statSec;
    }

    // this.display = prefix + Math.floor(seconds / 60) + ":" + textSec;
    this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

    if (seconds == 0) {
      console.log('finished');
      clearInterval(timer);
      this.resendOtp = true;
      this.displayTimer = false;
    }
  }, 1000);
}

  resendOTP(){
      this.phone = this.form.get('mobile')?.value
      const _data ={
          "mobileNo": "+91"+this.phone
      }
      this.authenticationService.sendOTP(_data)
      .pipe(first())
      .subscribe({
        next: (data) => {
          if(data.status){
              this.start(1);
              Swal.fire('Success', data.message, 'success');
          }
        },
          error: error => {
              this.error = error;
              Swal.fire("Please try again!","Error",  "error")   
          }
      });
  }
}


