import { Component ,OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { EmployeeService } from 'src/app/services/employee.service';
import { Router }       from '@angular/router';


interface Product {
  mst_product_id: number|string;
  branch_id: number|string;
  is_for_repeat_set_combo:boolean;
  // api_key: number|string;
  // language_code: number|string;
  // device_id: number|string;
  // device_token: number|string;
  // device_type: number|string;
  // price_type:number|string;
  // dishtype_id:number|string;
}



@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  is_for_repeat_set_combo:boolean = false
  error:string =""

  myForm = new FormGroup({
    branch_id: new FormControl('', Validators.required),
    mst_product_id: new FormControl('', Validators.required),
    is_for_repeat_set_combo : new FormControl(false, Validators.required)

  });

  product: Product = {
    mst_product_id: '',
    branch_id: '',
    is_for_repeat_set_combo: false,
  };
  
  constructor(private service:EmployeeService,private router:Router){

  }

  ngOnInit(): void {
    
  }

  onChange(event:any){
    this.is_for_repeat_set_combo = !this.is_for_repeat_set_combo;
  }

  onSubmit() {
    if (this.myForm.valid) {
      var data_ = {
        "api_key": "4J5CW5BrrQ/uRt7yeybdCitaH6Rdu/NqzOh8oVXpss8YYHK+0pNc4hXQXZjuU6Sq/BfNbvGoPA6n3WB5Z+JdziJdZy1qT5wvJOlMuXd2k/g=",
        "language_code": "en",
        "device_id": "2CEC3804-46E6-4803-8982-88CFFCD402DD",
        "device_token": "ex7n_U-pwlQ:APA91bGwFupIdjXEJqs4ZtdRwXLPPopDqwIU0gOH5n38ZPFEROk8WdAPQMsBxPLRd_3d8J3qIrUqUp8mEEvUjapCj7LVEOPO3kDt1lGT6r9L1C6VntoYuwbZnstfOSaZxeFXnibJXWKj",
        "device_type": "android",
        "price_type":1,
        "dishtype_id":"0",
        mst_product_id: this.myForm.get('mst_product_id')?.value,
        branch_id: this.myForm.get('branch_id')?.value,
        is_for_repeat_set_combo: this.is_for_repeat_set_combo?1:0,
      
      };


      console.log(JSON.stringify(data_))

      this.service.getData(data_)
      .pipe(first())
      .subscribe({
          next: (data) => {
            console.log(data)

          // const parsedData = JSON.parse(data); // Parse JSON string to object
          this.service.updateData(data); // Update data in the service

          this.router.navigate(['/app-product-list']);


        },
          error: error => {
              this.error = error;
              //Swal.fire("Error!",error.error.message,  "error")   
          }
      });
    
    }else{
      if(this.product.branch_id===''){
        alert('Please enter your branch ID')
      }else if (this.product.mst_product_id===''){
        alert('Please enter your product ID')
      }else if (!this.product.is_for_repeat_set_combo){
        alert('Select Repeat combo')
      }
    }
   
  }
  



}

