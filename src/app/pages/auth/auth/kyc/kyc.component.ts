import { Component,OnInit,ViewChild,ElementRef,Input} from '@angular/core';
import { UntypedFormBuilder,FormArray, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router }       from '@angular/router';
import { ConfirmedValidator } from '../../../../_services/confirmed.validator';
@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent implements OnInit{
  form: FormGroup;
  @ViewChild('aadhar') _viewAadhar: ElementRef;
  @ViewChild('pan') _viewPAN: ElementRef;
  @ViewChild('shopProof') _shopProof: ElementRef;

  validPattern = "^[a-zA-Z0-9]{15}$"

  error="";
  isSubmit= false;
  aadhar_!:String
  pan_!:String
  shopProof_!:String
  mobileNo :string="";
  cities : any =[]
  pincode : any =[]
  @Input() editable: boolean = false; // doesn't have to be an @Input

  constructor( private formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private router       : Router,
    ) {
  }
  public ngOnInit() : void{

    this.cities = JSON.parse(localStorage.getItem('cities')!);
    this.form = this.formBuilder.group({
      email: ['', [Validators.required,  	Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      // mobileNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      mobileNo: ['', [Validators.required]],
      tradeName: ['', [Validators.required]],
      gstNo: ['', [Validators.required,Validators.pattern(this.validPattern)]],
      addressLine1: ['', [Validators.required]],
      addressLine2: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pincode: [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")],
      aadhar: [''],
      pan: [''],
      password: ['', [Validators.minLength(8), Validators.required]],
      confirmPassword: ['',  Validators.required ],
      shopProof: [''],
    },{
      validator: ConfirmedValidator('password', 'confirmPassword')
    });

    this.mobileNo = localStorage.getItem("mobileNo")!;
    this.form.patchValue({
      mobileNo: this.mobileNo
    })
    //this.getPINCODE()

  }  

  inputText: string = '';
    convertToUppercase(e) {
    this.inputText = (e.target as HTMLInputElement).value.toUpperCase();
  }

  omit_special_char(event:any) {   
    var k;  
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }

  onSelectChange(e:any){
    if(e.target.value==="Input"){
    }
  }
  onFileChange(event:any, value:any) {
    const max_size = 1000000;
    const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];

    const reader = new FileReader();
    const file:File = event.target.files[0];


    if (file.size > max_size) {
        alert("Image Size should not exceed more than 1 MB")
        return false;
    }
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        if(value==0){
          this.aadhar_ = reader.result as string;
          this.form.patchValue({
            fileSource: reader.result
          });
          this.form.get('aadhar')?.setValue(event.target.files[0]);
        }else if(value==1){
          this.pan_ = reader.result as string;
          this.form.patchValue({
            fileSource: reader.result
          });
          this.form.get('pan')?.setValue(event.target.files[0]);
        }else{
          this.shopProof_ = reader.result as string;
          this.form.patchValue({
            fileSource: reader.result
          });
          this.form.get('shopProof')?.setValue(event.target.files[0]);
    
        }
     
      };
    }
  }

  
  get ff() { return this.form.controls; }

  getPINCODE(){
   const city=  this.form.get('city')?.value
    this.authenticationService.getPINCODE(city)
    .pipe(first())
    .subscribe({
    next: (data) => {
        if(data.status){
          this.form.patchValue({
            pincode: ''
          });
          this.pincode = data.data.pincode

        }
      },
        error: error => {
            this.error = error;
            Swal.fire("Please try again!","Error",  "error")   
        }
    });
  }

    fieldTextType_password: boolean;
    fieldTextType_cPassword:boolean

    toggle_password() {
      this.fieldTextType_password = !this.fieldTextType_password;
    }
    toggle_confirm_password() {
      this.fieldTextType_cPassword = !this.fieldTextType_cPassword;
    }
  
  onSubmit(){
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }

    const formDataNew = new FormData();   
      formDataNew.append('email', this.form.get('email')?.value.trim());
      formDataNew.append('mobileNo', this.form.get('mobileNo')?.value);
      formDataNew.append('tradeName', this.form.get('tradeName')?.value);
      formDataNew.append('password', this.form.get('password')?.value);
      formDataNew.append('gstNo', this.form.get('gstNo')?.value);
      formDataNew.append('addressLine1', this.form.get('addressLine1')?.value);
      formDataNew.append('addressLine2', this.form.get('addressLine2')?.value);
      formDataNew.append('state', this.form.get('state')?.value);
      formDataNew.append('city', this.form.get('city')?.value);
      formDataNew.append('pincode', this.form.get('pincode')?.value);
      formDataNew.append('aadharProof', this.form.get('aadhar')?.value);
      formDataNew.append('panProof', this.form.get('pan')?.value);
      formDataNew.append('shopProof', this.form.get('shopProof')?.value);
      // for(let keyValuePair of formDataNew.entries()){
      //   console.log(keyValuePair); 
      // }
      this.authenticationService.register(formDataNew)
      .pipe(first())
      .subscribe({
      next: (data) => {
          if(data.status){
            Swal.fire('Success', data.message, 'success');
            this.router.navigate(['/mobile-verification']);
          }
        },
          error: error => {
            this.error = error;
            Swal.fire("Error!",error.error.message,  "error")   
          }
      });


  }
  
}
