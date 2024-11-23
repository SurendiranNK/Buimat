import { Component,OnInit,ViewChild,ElementRef,Input,Renderer2 } from '@angular/core';
import { OrderService }   from '@services/order.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Validators, FormGroup,UntypedFormBuilder } from '@angular/forms';
import { AuthenticationService } from '../../../_services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { ExternalUrlService } from 'src/app/_services/externalurl.service';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent  implements OnInit{
  selectedTime:any
 
  currentHour: number;
  currentMinute: number;

  form: FormGroup;
  textAreaForm: FormGroup;

  @Input() editable: boolean = false; // doesn't have to be an @Input
  error = '';
  cartLists:any =[]
  subTotal_withGST:number = 0.0;
  subTotal_withOut_GST:number = 0.0;

  totalPrice = "";
  userInfo:any=""
  placeorderedData:any;
  productLists:any=[];
  _delivery_id=""
  result:any;
  resultData:any=[];

  deliveryAddress:any
  billingAddress:any
  locationInfo:any=""
  _addAddress :boolean=false;

  _selected_delivery_address:string="0"
  isSubmit = false;

  isOrderSubmit= false;
  cities : any =[]
  pincode : any =[]
  location_pincode:string="";
  minDate: NgbDate;
  selectedDate: NgbDate;
  timeSlot: any =  ['08.00 AM - 11.00 AM','11.00 AM - 03.00 PM','03.00 PM - 06.00 PM','After 06.00 PM'];


  constructor(
    private formBuilder: UntypedFormBuilder,private renderer: Renderer2, private el: ElementRef,
    private orderServices    : OrderService , private http: HttpClient,
    private authenticationService: AuthenticationService,private externalUrlService: ExternalUrlService,
    private router:Router,private modalService: NgbModal   ) {   
      this.textAreaForm = formBuilder.group({
        remarks: [''],
        terms:[false],
        date: ['', [Validators.required]],
        time: ['', [Validators.required]],

      });
  }
  public ngOnInit() : void{
    setTimeout(_ =>
    {
    
    }, 2000);

    var infoLocation = localStorage.getItem('locationInfo')!;
    if(infoLocation!=null){
      var data_location = JSON.parse(infoLocation);
      this.location_pincode= data_location.pincode;
    }
  


    const currentDate = new Date();
    this.currentHour = currentDate.getHours();
    this.currentMinute = currentDate.getMinutes();

    this.selectedTime ={hour:this.currentHour,minute:this.currentMinute}


    const today = new Date();
    // if(today.getHours()>=11 && today.getHours()<15){
    //   this.timeSlot = ['11.00 AM - 03.00 PM','03.00 PM - 06.00 PM','After 06.00 PM'];
    // }else if(today.getHours()>=15&& today.getHours()<18){
    //   this.timeSlot = ['03.00 PM - 06.00 PM','After 06.00 PM'];
    // }else{
    //   this.timeSlot = ['08.00 AM - 11.00 AM','11.00 AM - 03.00 PM','03.00 PM - 06.00 PM','After 06.00 PM'];
    // }


    if (today.getHours() >= 16) {
      this.minDate = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate()+1);
    }else{
      this.minDate = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
      if(today.getHours()>=8 && today.getHours()<11){
        this.timeSlot = ['11.00 AM - 03.00 PM','03.00 PM - 06.00 PM','After 06.00 PM'];
      } else if(today.getHours()>=11 && today.getHours()<15){
        this.timeSlot = ['03.00 PM - 06.00 PM','After 06.00 PM'];
      }else if(today.getHours()>=15&& today.getHours()<18){
        this.timeSlot = ['After 06.00 PM'];
      }else{
        this.timeSlot = ['08.00 AM - 11.00 AM','11.00 AM - 03.00 PM','03.00 PM - 06.00 PM','After 06.00 PM'];
      }
    }


    var userdata_ = localStorage.getItem('userInfo')!;
    this.userInfo = JSON.parse(userdata_); 
   // alert(JSON.stringify(this.userInfo))  
    this.getCartLists();
    this.getDeliveryAddress();
    this.getCities();

    this._delivery_id = localStorage.getItem('_delivery_id')!


    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      addressLine1: ['', [Validators.required]],
      addressLine2: ['', [Validators.required]],
      state: ['', [Validators.required]],
      landmark: [''],
      city: ['', [Validators.required]],
      pincode:['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")]],
    });

  }

  isCurrentDate(selectedData): boolean {
    const today = new Date();
    const _todayDate = today.getFullYear()+"-"+this.appendZeroIfNeeded(today.getMonth() + 1)+"-"+this.appendZeroIfNeeded(today.getDate());    
    return _todayDate === selectedData?true:false;
  }
  onChangeHour(event) {
    console.log('event', event);
  }
  getDeliveryAddress(){
    this.orderServices._getDeliveryAddress()
    .pipe(first())
    .subscribe({
        next: (data) => {
            this.deliveryAddress = data.data.deliveryAddress
            this.billingAddress = data.data.billingAddress
            this.deliveryAddress[0]['_id']="0"
           },
        error: error => {
            this.error = error;
            //Swal.fire("Error!",error.error.message,  "error")   
        }
    });
  }
  onChange(event){
    this._addAddress = !this._addAddress;
  }

  onChangeDate(event){
    const _date_ = this.textAreaForm.get('date')!.value
    const date_of_delivery = _date_.year+"-"+this.appendZeroIfNeeded(_date_.month)+"-"+this.appendZeroIfNeeded(_date_.day)
    const isTodayDate = this.isCurrentDate(date_of_delivery)
    if(!isTodayDate){
      this.timeSlot = ['08.00 AM - 11.00 AM','11.00 AM - 03.00 PM','03.00 PM - 06.00 PM','After 06.00 PM'];
    }else{
      this.textAreaForm.get('time')?.setValue('')
      const today = new Date();
      if(today.getHours()>=8 && today.getHours()<11){
        this.timeSlot = ['11.00 AM - 03.00 PM','03.00 PM - 06.00 PM','After 06.00 PM'];
      } else if(today.getHours()>=11 && today.getHours()<15){
        this.timeSlot = ['03.00 PM - 06.00 PM','After 06.00 PM'];
      }else if(today.getHours()>=15&& today.getHours()<18){
        this.timeSlot = ['After 06.00 PM'];
      }else{
        this.timeSlot = ['08.00 AM - 11.00 AM','11.00 AM - 03.00 PM','03.00 PM - 06.00 PM','After 06.00 PM'];
      }
    }
  }
  getCartLists(){
      this.orderServices._getCartLists(this.location_pincode)
      .pipe(first())
      .subscribe({
          next: (data) => {
          this.cartLists = data.data.carts;
          localStorage.removeItem('cartLists');
          localStorage.setItem('cartLists',JSON.stringify(this.cartLists));
          for(var k=0;k<this.cartLists.length;k++){
            this.subTotal_withGST = this.subTotal_withGST+ this.cartLists[k].totalPriceWithGST;
            this.subTotal_withOut_GST = this.subTotal_withOut_GST+ this.cartLists[k].totalPriceWithoutGST;
          }
        },
          error: error => {
              this.error = error;
              //Swal.fire("Error!",error.error.message,  "error")   
          }
      });
  
  }
  Space(event:any){
    if(event.target.selectionStart === 0 && event.code==="Space"){
      event.preventDefault();
    }
  }
  appendZeroIfNeeded(number: number): string {
    // Check if the number is between 1 and 9 (inclusive)
    if (number >= 1 && number <= 9) {
      // Append a leading zero and convert it to a string
      return '0' + number.toString();
    } else {
      // Return the original number as a string
      return number.toString();
    }
  }

  // onTimeChange(newTime: Date) {
  //   console.log("Selected time: ", newTime);
  //   // You can now use newTime as needed
  // }
  placeOrder(){
    this.isOrderSubmit = true
    
    if (this.textAreaForm.invalid) {
      return;
    }
    if(!this.textAreaForm.get('terms')?.value){
      Swal.fire({
        text: "Please accept the terms and conditions to place order!",
        icon: "question"
      });
      return
    }

    var infoLocation = localStorage.getItem('locationInfo')!;
    if(infoLocation!=null){
      this.locationInfo = JSON.parse(infoLocation);
    }
    if(this._delivery_id ==""){
      Swal.fire({
        text: "Please choose or add the delivery address for the pincode : "+this.locationInfo.pincode+"",
        icon: "question",
        timer: 2000
      });
      return
    }
    //console.log(JSON.stringify(this.cartLists))
    if(this.cartLists.length==0){
      Swal.fire({
        text: "Invalid Order. Please add the products",
        icon: "question",
        timer: 2000
      });
      return
    }
    const const_date = this.textAreaForm.get('date')?.value;
    // const timeofDelivery = this.selectedTime.hour+":"+this.selectedTime.minute+":00"
    // const date_of_delivery = const_date.year+"-"+this.appendZeroIfNeeded(const_date.month)+"-"+this.appendZeroIfNeeded(const_date.day)+" "+timeofDelivery;
    const date_of_delivery = const_date.year+"-"+this.appendZeroIfNeeded(const_date.month)+"-"+this.appendZeroIfNeeded(const_date.day)

    
    for(var i=0;i<this.cartLists.length;i++){
           var orderLists = {
              "cgst": this.cartLists[i].cgst,
              "productId": this.cartLists[i].productDetails._id,
              "orderedUnit": this.cartLists[i].orderedUnit._id,
              "quantity": this.cartLists[i].quantity,
              "sgst":this.cartLists[i].sgst,
              "totalGST": this.cartLists[i].totalGST,
              "totalPriceWithGST":this.cartLists[i].totalPriceWithGST,
              "totalPriceWithoutGST":this.cartLists[i].totalPriceWithoutGST,
              "unitPriceWithGST":this.cartLists[i].unitPriceWithGST,
              "unitPriceWithoutGST":this.cartLists[i].unitPriceWithoutGST,
              "cartId": this.cartLists[i]._id
            };
            this.productLists.push(orderLists)
    }
    

    this.placeorderedData={
      "totalPriceWithoutGST": this.subTotal_withOut_GST,
      "totalPriceWithGST": this.subTotal_withGST,
      "remarks":this.textAreaForm.get('remarks')?.value.trim(),
      "deliveryDate":date_of_delivery,
      "timeslot":this.textAreaForm.get('time')?.value,
      "productInfo": "Product",
      "deliveryAddress": {
          "addressLine1": this.locationInfo.addressLine1,
          "addressLine2": this.locationInfo.addressLine2,
          "city": this.locationInfo.city,
          "state": this.locationInfo.state,
          "contactNumber": this.locationInfo.contactNumber,
          "landmark":this.locationInfo.landmark,
          "pincode": this.locationInfo.pincode,
          "username": this.locationInfo.username
      },"products":this.productLists
      
    }
     console.log(JSON.stringify(this.placeorderedData))
      this.orderServices._initPayment(this.placeorderedData)
      .pipe(first())
      .subscribe({
          next: (data) => {
            if(data.status){
              
              Swal.fire({
                title: "Success",
                text:  data.message,
                timer:1200,
                icon: "success"
              });
              this.result = data;
              this.resultData = this.result.data
              this.payment(this.resultData.orderId,"200",this.resultData.accessKey);

            }else{
              Swal.fire('Warning', data.message, 'error');
            }
            
          
        
        },
          error: error => {
              this.error = error;
              //Swal.fire("Error!",error.error.message,  "error")   
          }
      });
  
  
  }
  payment(orderId,amount,apiKey){
    // return this.http.post(`https://api.easebuzz.in/initiatePayment/initiatePayment`, {
    //   orderId,
    //   amount,
    //   apiKey,
    // });

    // const externalUrl = `https://testpay.easebuzz.in/pay/`+this.resultData.accessKey;; // Replace with your external URL
    
    // // Open the external URL in a new tab/window
    // const newWindow = window.open(externalUrl, '_blank');

    // // Optional: You can make an HTTP request to the external URL
    // if (newWindow) {
    //   this.externalUrlService.getExternalUrlData(externalUrl).subscribe(
    //     (response) => {
    //       console.log('Response from external URL:', response);
    //       // Do something with the response
    //     },
    //     (error) => {
    //       console.error('Error fetching data from external URL:', error);
    //     }
    //   );
    // }

    const externalUrl = `https://pay.easebuzz.in/pay/`+this.resultData.accessKey;; // Replace with your external URL

    this.http.get(externalUrl, { responseType: 'text' }).subscribe(
      (response) => {
        console.log('Response from external URL:', response);
      },
      (error) => {
        console.error('Error fetching external URL:', error);
      }
    );

    // Open the external URL in the same tab
    window.location.href = externalUrl;

    //window.location.href = `https://pay.easebuzz.in/initiate_seamless_payment/`+this.resultData.accessKey;
    // this.orderServices.payment(this.resultData.accessKey)
    // .pipe(first())
    // .subscribe({
    //     next: (data) => {
    //       alert(JSON.stringify(data))
    //   },
    //     error: error => {
    //         this.error = error;
    //     }
    // });
  }

  
  get ff() { return this.form.controls; }
  get ft() { return this.textAreaForm.controls; }


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
  onSubmit(){
      this.isSubmit = true;
      if (this.form.invalid) {
        return;
      }
      var data_ = {
        'username': this.form.get('username')?.value.trim(),
        'contactNumber': this.form.get('contactNumber')?.value,
        'addressLine1': this.form.get('addressLine1')?.value,
        'addressLine2': this.form.get('addressLine2')?.value,
        'landmark': this.form.get('landmark')?.value,
        'state': this.form.get('state')?.value,
        'city': this.form.get('city')?.value,
        'pincode': this.form.get('pincode')?.value
      };
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
    this._addAddress = !this._addAddress;
    this.form.reset();
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      contactNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      addressLine1: ['', [Validators.required]],
      addressLine2: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      pincode:['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")]],
    });
  }

  OpenTerms(content){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size:'lg'}).result.then((result) => {
    }, (reason) => {
    });
  }
  selectDelieveryAddress(data:any){
    const jsonData={
      'pincode': data.pincode,
      'locationDetail':data.city,
      'addressLine1':data.addressLine1,
      "addressLine2": data.addressLine2,
      "city":data.city,
      "state": data.state,
      "contactNumber":data.contactNumber,
      "username": data.username,
      "landmark": data.landmark
    }
    localStorage.setItem('_delivery_id',data._id);
    localStorage.setItem('locationInfo', JSON.stringify(jsonData));
    window.location.reload();
  }
}

