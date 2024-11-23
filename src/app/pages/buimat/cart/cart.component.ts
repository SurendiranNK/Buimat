import { Component,OnInit,ViewChild,ElementRef,Input} from '@angular/core';
import { OrderService }   from '@services/order.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MessageService } from 'primeng/api';
import { ProductService } from '@services/products.service';
import { Location } from '@angular/common';
import { SharedService } from '@services/shared.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [MessageService]
})
export class CartComponent implements OnInit{
  //@Input() editable: boolean = false; // doesn't have to be an @Input
  error = '';
  cartLists:any =[]
  subTotal:number = 0.0;
  pincode:string="";

  totalPrice = "";
  locationInfo:any=""
  constructor(
    private orderServices: OrderService,    
    private messageService:MessageService,
    private productServices:ProductService,   
    private location :Location,
    private sharedServices:SharedService,
    private router:Router   ) {   
  }

  public ngOnInit() : void{

    var infoLocation = localStorage.getItem('locationInfo')!;
    if(infoLocation!=null){
      var data_location = JSON.parse(infoLocation);
      this.pincode= data_location.pincode;
    }
  
    setTimeout(_ =>
    {
    
    }, 2000);

    var userdata_ = localStorage.getItem('cartLists')!;

    // this.cartLists = JSON.parse(userdata_);
    // console.log(this.cartLists)

    this.getCartLists();
    this.sharedServices.sharedPINCODEupdate$.subscribe((value) => {
      // var infoLocation = localStorage.getItem('locationInfo')!;
      //   if(infoLocation!=null){
      //     this.locationInfo = JSON.parse(infoLocation);
      //     alert(this.locationInfo.pincode)
      //   }
    });
    
  }


  getCartLists(){
      this.orderServices._getCartLists(this.pincode)
      .pipe(first())
      .subscribe({
          next: (data) => {
          this.cartLists = data.data.carts;
          localStorage.removeItem('cartLists');
          localStorage.setItem('cartLists',JSON.stringify(this.cartLists));
          this.subTotal=0;
          for(var k=0;k<this.cartLists.length;k++){
            this.subTotal = this.subTotal+ this.cartLists[k].totalPriceWithGST;
          }
        },
          error: error => {
              this.error = error;
              //Swal.fire("Error!",error.error.message,  "error")   
          }
      });
  
  }


  // "cartId": "655730365720b622b1db5e01",
  // "cgst": 12,
  // "sgst": 12,
  // "unitPriceWithoutGST": 298.39,
  // "unitPriceWithGST": 370,
  // "totalPriceWithGST": 23680,
  // "totalPriceWithoutGST": 19096.96,
  // "totalGST": 4583.04,
  // "quantity": 2,
  // "priceFormulaWithGST": "qty * 32 * 370",
  // "priceFormulaWithoutGST": "qty * 32 * 298.39",
  // "productId": "65546b64e1867c800a3a9ed5",
  // "orderedUnit": "6526343d32543e0703093e5c"
  
  onNumberChange(inputValue,quantity, position){
    //console.log(quantity)
    const json_cart_data =  this.cartLists[position]
    var minimumOrderQty = json_cart_data.productDetails.minimumOrderQty;

    
    var qty = parseInt(inputValue.target.value)
 
    if(qty<minimumOrderQty){
      this.messageService.add({
        severity: "warn",
        detail: "Minimum quantity cannot be less than "+minimumOrderQty
      });
      qty= minimumOrderQty;
    }
    if(inputValue.target.value === "" || inputValue.target.value === null){
      const inputElement = inputValue.target as HTMLInputElement;
      inputElement.value = minimumOrderQty;
      qty= minimumOrderQty
    }

    this.calculatePrice(qty, position)

  }
  updateCartQuantity(position, isAdd){
  
    const json_cart_data =  this.cartLists[position]
    var minimumOrderQty = json_cart_data.productDetails.minimumOrderQty;
    var cartQuantity = json_cart_data.quantity;
    var qty = parseInt(cartQuantity)

   
    if(isAdd){
      qty++
    } else{
      if(cartQuantity==minimumOrderQty){
        this.messageService.add({
          severity: "warn",
          detail: "Minimum quantity cannot be less than "+minimumOrderQty
        });
        return;
      } 
      qty--
    }
    this.calculatePrice(qty, position)
  }

  calculatePrice(qty, position){
    const json_cart_data =  this.cartLists[position]
    var isVariablePricing = json_cart_data.productDetails.zone.variablePricings.length==0?false:true;
    var unitPrice=''
    var variablePricingLists:any
    
    if(isVariablePricing){
      variablePricingLists = json_cart_data.productDetails.zone.variablePricings;
      let foundIndex = -1; // Initialize with a value indicating not found
      for(let i=0;i<variablePricingLists.length;i++){
         if(qty>= parseInt(variablePricingLists[i].from) && qty<=parseInt( variablePricingLists[i].to)){
        

              var price = variablePricingLists[i].price;
              unitPrice = price
              var price_GST = eval(json_cart_data.priceFormulaWithGST);
              var price_without_GST = eval(json_cart_data.priceFormulaWithoutGST);
              foundIndex = i;
              break;
          }
      }
      if(foundIndex== -1){
        var length =  variablePricingLists.length - 1
        var price = variablePricingLists[length].price;
        unitPrice = price
        var price_GST = eval(json_cart_data.priceFormulaWithGST);
        var price_without_GST = eval(json_cart_data.priceFormulaWithoutGST);
      }

    }else{
      variablePricingLists = []
      var price =json_cart_data.productDetails.zone.price;
      unitPrice = price
      var price_GST = eval(json_cart_data.priceFormulaWithGST);
      var price_without_GST = eval(json_cart_data.priceFormulaWithoutGST);
    }
    var jsonCart= {
        "cartId": json_cart_data._id,
        "productId":json_cart_data.productDetails._id, 
        "quantity": qty, 
        "unitPrice": unitPrice, 
        "totalPriceWithGST": price_GST,
        "totalPriceWithoutGST": price_without_GST,
        "cgst": json_cart_data.productDetails.cgst,
        "sgst": json_cart_data.productDetails.sgst,
        "orderedUnit": json_cart_data.orderedUnit._id,
        "priceFormulaWithGST": json_cart_data.priceFormulaWithGST,
        "priceFormulaWithoutGST": json_cart_data.priceFormulaWithoutGST
    }
    
    this.productServices.updateCart(jsonCart, this.pincode)
    .pipe(first())
    .subscribe({
        next: (data) => {
        if(data.status){
          this.getCartLists();
        }
      },
        error: error => {
            this.error = error;
            Swal.fire("Error!",error.error.message,  "error")   
        }
    });
    
  }
  deleteCart(cartID , productName){

    Swal.fire({
      title: "Are you sure?",
      text: "Do want to remove the product "+productName+" from your cart",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.value) {
        this.orderServices.deleteCart(cartID)
        .pipe(first())
        .subscribe({
            next: (data) => {
              this.sharedServices.updateCartNumber(-1)
            
              this.messageService.add({
                severity: "success",
                detail: productName+" has been deleted from your cart"
              });
              this.getCartLists();
          },
            error: error => {
                this.error = error;
                Swal.fire("Error!",error.error.message,  "error")   
            }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    
    });
  
  }

  backtoShop(){
    this.router.navigate(['']);
    // this.location.back()
  }
  // updateCart(){
  //   this.getCartLists();
  // }
  proceedToCheckout(){
    this.router.navigate(['/checkout']);
  }


}

