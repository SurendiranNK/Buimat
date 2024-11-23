import { Component,OnInit,ViewChild,ElementRef,Input} from '@angular/core';
import { OrderService }   from '@services/order.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Validators, FormGroup,UntypedFormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ConfirmedValidator } from '../../../_services/confirmed.validator';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
  providers: [MessageService]

})
export class VendorComponent   implements OnInit{

  form: FormGroup;
  passwordForm: FormGroup;

  @Input() editable: boolean = false; // doesn't have to be an @Input
  error = '';
  cartLists:any =[]
  subTotal_withGST:number = 0.0;
  subTotal_withOut_GST:number = 0.0;
  _orderDetails:any
  selected_OrderId ="0"
  totalPrice = "";
  userInfo:any=""
  placeorderedData:any;
  productLists:any=[];
  myOrdersLists:any=[];
  
  _paymentHistoryData:any=[];
  splitDeliveryDetails:any=[];

  _orderDetailedInformation:any={}
  _orderDetailedProductLists:any[]=[]

  _delivery_id=""

  _isViewOrder:boolean = false;
  _is_EditAddress:boolean =false;
  _addAddress :boolean=false;


  deliveryAddress:any
  billingAddress:any
  locationInfo:any=""

  _selected_delivery_address:string="0"
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];
  isSubmit= false;
  isPasswordSubmit= false;
  cities : any =[]
  pincode : any =[]
  is_SplitDelivery= false;

  temp_addressData :any ={}

  constructor(
    private formBuilder: UntypedFormBuilder,
    private orderServices    : OrderService ,
    private messageService:MessageService,
    private authenticationService: AuthenticationService,
    private router:Router   ) {   
  }
  bearerToken = "";
  public ngOnInit() : void{
    setTimeout(_ =>
    {
    
    }, 2000);

    var userdata_ = localStorage.getItem('userInfo')!;
    this.userInfo = JSON.parse(userdata_);   
    this.getDeliveryAddress();
    this.getCities();
    this.getMyOrders();
    this.getPaymentHistory();
    this._delivery_id = localStorage.getItem('_delivery_id')!
    this.bearerToken =  localStorage.getItem('token')!
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      addressLine1: ['', [Validators.required]],
      addressLine2: ['', [Validators.required]],
      landmark: [''],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pincode:['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")]],
    });

    this.passwordForm = this.formBuilder.group({
      oldPassword: ['',[Validators.required]],
      newPassword: ['', [Validators.minLength(8), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },{
      validator: ConfirmedValidator('newPassword', 'confirmPassword'),
    });
  }
  onSubmit(){
    this.isSubmit = true;
      if (this.form.invalid) {
        return;
      }

      if(!this._is_EditAddress){
        var data_ = {
          'username': this.form.get('username')?.value.trim(),
          'contactNumber': this.form.get('contactNumber')?.value,
          'addressLine1': this.form.get('addressLine1')?.value,
          'addressLine2': this.form.get('addressLine2')?.value,
          'landmark':this.form.get('landmark')?.value,
          'state': this.form.get('state')?.value,
          'city': this.form.get('city')?.value,
          'pincode': this.form.get('pincode')?.value
        };
        console.log("add  -- "+JSON.stringify(data_))
        this.authenticationService.addDeliveryAddress(data_)
        .pipe(first())
        .subscribe({
        next: (data) => {
            if(data.status){
              this.getDeliveryAddress();
              Swal.fire('Success', data.message, 'success');
              this.formReset();
           }
          },
            error: error => {
              this.error = error;
              Swal.fire("Error!",error.error.message,  "error")   
            }
        });
      }else{

        var editData = {
          'username': this.form.get('username')?.value.trim(),
          'contactNumber': this.form.get('contactNumber')?.value,
          'addressLine1': this.form.get('addressLine1')?.value,
          'addressLine2': this.form.get('addressLine2')?.value,
          'landmark':this.form.get('landmark')?.value,
          'state': this.form.get('state')?.value,
          'city': this.form.get('city')?.value,
          'pincode': this.form.get('pincode')?.value,
          '_id':this.temp_addressData._id
        };

        console.log("update  -- "+JSON.stringify(editData))
        this.authenticationService.updateDeliveryAddress(editData)
        .pipe(first())
        .subscribe({
        next: (data) => {
            if(data.status){
              this.getDeliveryAddress();
              Swal.fire('Success', data.message, 'success');
              this.formReset();
           }
          },
            error: error => {
              this.error = error;
              Swal.fire("Error!",error.error.message,  "error")   
            }
        });
      }

  }

  onChangePassword(){
    this.isPasswordSubmit = true;
    if (this.passwordForm.invalid) {
      return;
    }
      var data_={
        "email": this.userInfo.email,
        "oldPassword": this.passwordForm.get('oldPassword')?.value,
        "newPassword": this.passwordForm.get('confirmPassword')?.value,
      }
      this.authenticationService.changePassword(data_)
      .pipe(first())
      .subscribe({
        next: (data) => {
            if(data.status){
              Swal.fire('Success', data.message, 'success');
              this.formReset();
            }else{
              Swal.fire('Error', data.message, 'error');
            }
          },
            error: error => {
              Swal.fire("Error!",error.error.message,  "error")   
            }
        });
   
  }
  getDeliveryAddress(){
    this.orderServices._getDeliveryAddress()
    .pipe(first())
    .subscribe({
        next: (data) => {
            this.deliveryAddress = data.data.deliveryAddress
            this.billingAddress = data.data.billingAddress
            this.deliveryAddress[0]['_id']="0"

            console.log("==="+JSON.stringify(this.deliveryAddress))
           },
        error: error => {
            this.error = error;
            //Swal.fire("Error!",error.error.message,  "error")   
        }
    });
  }
  addAddress(){
    this._addAddress = !this._addAddress;
  }

  cancel(){
    this._is_EditAddress = false;
    this._addAddress = false;
    this.formReset();
  }

  Space(event:any){
    if(event.target.selectionStart === 0 && event.code==="Space"){
      event.preventDefault();
    }
  }
  get fp() { return this.passwordForm.controls; }
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

          if(this._is_EditAddress){
            this.form.patchValue({
              pincode: this.temp_addressData.pincode
            });
          }

        }
      },
        error: error => {
            this.error = error;
            Swal.fire("Please try again!","Error",  "error")   
        }
    });
  }
  cancelOrder(orderID,totalPrice){
    var data={
      "totalAmount": totalPrice
    }
    Swal.fire({
      title: "Are you sure?",
      text: "Do want to cancel the order "+orderID,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#109c22",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((result) => {
      if (result.value) {
          this.orderServices.cancelOrder(orderID, data)
          .pipe(first())
          .subscribe({
              next: (data) => {
                console.log(JSON.stringify(data))

                  if(data.status){
                    this.getMyOrders()
                    Swal.fire({
                              title: "Deleted!",
                              text:  data.message,
                              icon: "success",
                              timer:1000
                            });
                            
                  }else{
                    Swal.fire( {
                      title: "",
                      text:  data.message,
                      icon: "info",
                      timer:10000
                    })

                  }
                },
              error: error => {
                  this.error = error;
                  //Swal.fire("Error!",error.error.message,  "error")   
              }
          });
      
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }


  fieldTextType_oPassword: boolean;
  fieldTextType_nPassword:boolean;
  fieldTextType_cNewPassword:boolean;


  toggle_old_password() {
    this.fieldTextType_oPassword = !this.fieldTextType_oPassword;
  }
  toggle_new_password() {
    this.fieldTextType_nPassword = !this.fieldTextType_nPassword;
  }
  toggle_confirm_password() {
    this.fieldTextType_cNewPassword = !this.fieldTextType_cNewPassword;
  }

  editAddress(data){
    this.temp_addressData = data;
    this._is_EditAddress= true;
    this._addAddress= true;
    this.form.patchValue({
      username:data.username,
      contactNumber:data.contactNumber,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      landmark: data.landmark,
      state: data.state,
      city: data.city,
    });
    this.getPINCODE()
  }

  deleteAddress(id){
    Swal.fire({
      title: "",
      text: "Are you sure?. Do want to delete the address",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#109c22",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!"
    }).then((result) => {
      if (result.value) {

        this.orderServices._deleteDeliveryaddress(id)
        .pipe(first())
        .subscribe({
            next: (data) => {
                if(data.status){
                  this.messageService.add({
                    severity: "success",
                    detail: data.message,
                  });
                  this.getDeliveryAddress();
                  this.cancel();
                }  
              },
            error: error => {
                this.error = error;
                this.messageService.add({
                  severity: "error",
                  detail: error.error.message
                });
            }
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
       
      }
    
    });
  }

  getCities(){
    this.authenticationService.getCities()
    .pipe(first())
    .subscribe({
    next: (data) => {
        if(data.status){
          this.cities = data.data.cities
        }
      },
        error: error => {
            this.error = error;
            Swal.fire("Please try again!","Error",  "error")   
        }
    });
  }
  omit_special_char(event:any) {   
    var k;  
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)); 
  }

  formReset(){
    this.isSubmit = false;
    this._addAddress=false;
    this._is_EditAddress= false
    this.isPasswordSubmit = false;
    this.form.reset();
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      addressLine1: ['', [Validators.required]],
      addressLine2: ['', [Validators.required]],
      landmark: [''],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pincode:['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")]],
    });

    this.passwordForm = this.formBuilder.group({
      oldPassword: ['',[Validators.required]],
      newPassword: ['', [Validators.minLength(8), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },{
      validator: ConfirmedValidator('newPassword', 'confirmPassword')
   });

  }

    getMyOrders(){
      this.orderServices.getMyOrders()
      .pipe(first())
      .subscribe({
          next: (data) => {
              this.myOrdersLists = data.data.orders
             },
          error: error => {
              this.error = error;
          }
      });
    }

    getPaymentHistory(){
      this.orderServices.getMyHistory()
      .pipe(first())
      .subscribe({
          next: (data) => {
              this._paymentHistoryData = data.data.paymentHistories
             },
          error: error => {
              this.error = error;
          }
      });
    }

    onTableDataChange(event: any) {
      this.page = event;
    }
  
    onTableSizeChange(event: any): void {
      this.tableSize = event.target.value;
      this.page = 1;
    }
    viewOrderInfo(orderInfo:any){
      this._orderDetails = orderInfo;
      this.is_SplitDelivery = false;
      if(this.selected_OrderId == orderInfo.orderId){
        this.selected_OrderId = '';
      }else{
        this.selected_OrderId = orderInfo.orderId ;
      }

     

      this.orderServices.getOrderInformation(this.selected_OrderId)
      .pipe(first())
      .subscribe({
          next: (data) => {
            console.log("========"+JSON.stringify(data.data))
              this._orderDetailedInformation = data.data.orderInfo[0]._id;
              this.is_SplitDelivery= this._orderDetailedInformation.isSplitDelivery;
              this._orderDetailedProductLists= data.data.orderInfo[0].products;
              if(this.is_SplitDelivery){
                this.splitDeliveryDetails= data.data.orderInfo[0].splitDeliveryDetails
              }else{
                this.splitDeliveryDetails=[]
              }
             },
          error: error => {
              this.error = error;
              //Swal.fire("Error!",error.error.message,  "error")   
          }
      });
    }
    onBackClick(){
      this._isViewOrder = !this._isViewOrder
    }
}

